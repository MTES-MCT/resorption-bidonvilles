const COLUMN_NAME = 'action_ref';
const TABLE_NAMES = ['actions', 'actions_history'];

const buildActionRefCaseSql = (rowAlias = '') => {
    const p = rowAlias ? `${rowAlias}.` : '';

    return `CASE
        WHEN ${p}fk_departement IS NOT NULL
         AND ${p}created_at IS NOT NULL
         AND ${p}action_id IS NOT NULL
        THEN CONCAT(
            'ID',
            ${p}fk_departement::text,
            EXTRACT(YEAR FROM ${p}created_at)::int::text,
            LPAD(${p}action_id::text, 4, '0')
        )
        ELSE NULL
    END`;
};


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

const addActionRefColumnWithDefaults = async (queryInterface, Sequelize, tableName, transaction) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.STRING(13),
            allowNull: true,
        },
        { transaction },
    );

    await queryInterface.sequelize.query(
        `UPDATE "${tableName}"
         SET "${COLUMN_NAME}" = ${buildActionRefCaseSql()};`,
        { transaction },
    );
};

const removeActionRefColumn = (queryInterface, tableName, transaction) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
    { transaction },
);

const createActionRefTriggerFunction = async (queryInterface, transaction) => {
    await queryInterface.sequelize.query(
        `CREATE OR REPLACE FUNCTION set_action_ref() RETURNS trigger AS $$
        BEGIN
            NEW.action_ref := ${buildActionRefCaseSql('NEW')};
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`,
        { transaction },
    );
};

const createActionRefTriggerForTable = async (queryInterface, tableName, transaction) => {
    await queryInterface.sequelize.query(
        `CREATE TRIGGER trg_set_action_ref_${tableName}
         BEFORE INSERT
         ON "${tableName}"
         FOR EACH ROW
         EXECUTE FUNCTION set_action_ref();`,
        { transaction },
    );
};

const dropActionRefTriggerForTable = async (queryInterface, tableName, transaction) => {
    await queryInterface.sequelize.query(
        `DROP TRIGGER IF EXISTS trg_set_action_ref_${tableName} ON "${tableName}";`,
        { transaction },
    );
};

const dropActionRefTriggerFunction = async (queryInterface, transaction) => {
    await queryInterface.sequelize.query(
        'DROP FUNCTION IF EXISTS set_action_ref();',
        { transaction },
    );
};

module.exports = {
    async up(queryInterface, Sequelize) {
        await runInTransaction(queryInterface, async (transaction) => {
            await Promise.all(TABLE_NAMES.map(tableName => addActionRefColumnWithDefaults(queryInterface, Sequelize, tableName, transaction)));

            await createActionRefTriggerFunction(queryInterface, transaction);

            await Promise.all(TABLE_NAMES.map(tableName => createActionRefTriggerForTable(queryInterface, tableName, transaction)));
        });
    },

    async down(queryInterface) {
        await runInTransaction(queryInterface, async (transaction) => {
            await Promise.all(TABLE_NAMES.map(tableName => dropActionRefTriggerForTable(queryInterface, tableName, transaction)));

            await dropActionRefTriggerFunction(queryInterface, transaction);

            await Promise.all(TABLE_NAMES.map(tableName => removeActionRefColumn(queryInterface, tableName, transaction)));
        });
    },
};
