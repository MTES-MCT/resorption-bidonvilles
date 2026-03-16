const COLUMN_NAME = 'population_updated_at';
const TABLE_NAMES = ['shantytowns', 'ShantytownHistories'];
const POPULATION_COLUMNS = [
    'population_total',
    'population_total_females',
    'population_couples',
    'population_minors',
    'population_minors_girls',
    'population_minors_0_3',
    'population_minors_3_6',
    'population_minors_6_12',
    'population_minors_12_16',
    'population_minors_16_18',
    'minors_in_school',
];

const runInTransaction = async (queryInterface, callback) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await callback(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const addPopulationUpdatedAtColumn = async (queryInterface, Sequelize, tableName, transaction) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.DATE,
            allowNull: true,
        },
        { transaction },
    );
};

const removePopulationUpdatedAtColumn = (queryInterface, tableName, transaction) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
    { transaction },
);

// On liste les dernières modifications du nombre d'habitants sur chaque site pour donner cette date dans population_updated_at.
const hydratePopulationUpdatedAt = async (queryInterface, transaction) => {
    const orderedPopulationColumns = POPULATION_COLUMNS.join(',\n                ');
    const laggedPopulationColumns = POPULATION_COLUMNS
        .map(column => `LAG(${column}) OVER version_window AS previous_${column}`)
        .join(',\n                ');
    const populationHasValueCondition = POPULATION_COLUMNS
        .map(column => `${column} IS NOT NULL`)
        .join(' OR ');
    const populationHasChangedCondition = POPULATION_COLUMNS
        .map(column => `${column} IS DISTINCT FROM previous_${column}`)
        .join(' OR ');

    await queryInterface.sequelize.query(
        `CREATE TEMP TABLE tmp_population_updated_at ON COMMIT DROP AS
        WITH all_versions AS (
            SELECT
                shantytown_id,
                hid,
                updated_at,
                0 AS source_order,
                ${orderedPopulationColumns}
            FROM "ShantytownHistories"

            UNION ALL

            SELECT
                shantytown_id,
                NULL AS hid,
                updated_at,
                1 AS source_order,
                ${orderedPopulationColumns}
            FROM shantytowns
        ),
        versions_with_previous AS (
            SELECT
                shantytown_id,
                hid,
                updated_at,
                source_order,
                ${orderedPopulationColumns},
                LAG(updated_at) OVER version_window AS previous_updated_at,
                ${laggedPopulationColumns}
            FROM all_versions
            WINDOW version_window AS (
                PARTITION BY shantytown_id
                ORDER BY updated_at ASC, source_order ASC, COALESCE(hid, 2147483647) ASC
            )
        ),
        versions_with_change_date AS (
            SELECT
                shantytown_id,
                hid,
                MAX(
                    CASE
                        WHEN (
                            previous_updated_at IS NULL
                            AND (${populationHasValueCondition})
                        ) OR (${populationHasChangedCondition})
                            THEN updated_at
                        ELSE NULL
                    END
                ) OVER (
                    PARTITION BY shantytown_id
                    ORDER BY updated_at ASC, source_order ASC, COALESCE(hid, 2147483647) ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS computed_population_updated_at
            FROM versions_with_previous
        )
        SELECT
            shantytown_id,
            hid,
            computed_population_updated_at
        FROM versions_with_change_date`,
        { transaction },
    );

    await Promise.all([
        queryInterface.sequelize.query(
            `UPDATE shantytowns
            SET ${COLUMN_NAME} = source.computed_population_updated_at
            FROM tmp_population_updated_at source
            WHERE source.hid IS NULL
                AND source.shantytown_id = shantytowns.shantytown_id`,
            { transaction },
        ),
        queryInterface.sequelize.query(
            `UPDATE "ShantytownHistories"
            SET ${COLUMN_NAME} = source.computed_population_updated_at
            FROM tmp_population_updated_at source
            WHERE source.hid = "ShantytownHistories".hid`,
            { transaction },
        ),
    ]);
};

module.exports = {
    async up(queryInterface, Sequelize) {
        await runInTransaction(queryInterface, async (transaction) => {
            await Promise.all(
                TABLE_NAMES.map(tableName => addPopulationUpdatedAtColumn(
                    queryInterface,
                    Sequelize,
                    tableName,
                    transaction,
                )),
            );

            await hydratePopulationUpdatedAt(queryInterface, transaction);
        });
    },

    async down(queryInterface) {
        await runInTransaction(queryInterface, transaction => Promise.all(
            TABLE_NAMES.map(tableName => removePopulationUpdatedAtColumn(queryInterface, tableName, transaction)),
        ));
    },
};
