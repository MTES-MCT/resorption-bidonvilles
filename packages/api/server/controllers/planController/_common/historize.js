const sequelize = require('#db/sequelize');

module.exports = async (planId, transaction) => {
    // save current state into history
    const response = await sequelize.query(
        `INSERT INTO plans_history(
            plan_id,
            name,
            started_at,
            closed_at,
            expected_to_end_at,
            in_and_out,
            goals,
            fk_category,
            location_type,
            location_details,
            fk_location,
            final_comment,
            created_by,
            created_at,
            updated_by,
            updated_at
        ) (SELECT
            plan_id,
            name,
            started_at,
            closed_at,
            expected_to_end_at,
            in_and_out,
            goals,
            fk_category,
            location_type,
            location_details,
            fk_location,
            final_comment,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM plans2
        WHERE plan_id = :planId)
        RETURNING hid AS id`,
        {
            replacements: {
                planId,
            },
            transaction,
        },
    );
    const hid = response[0][0].id;

    await sequelize.query(
        `INSERT INTO plan_managers_history(
            fk_plan,
            fk_user,
            created_by,
            created_at,
            updated_by,
            updated_at
        ) (SELECT
            :hid,
            fk_user,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM plan_managers
        WHERE fk_plan = :planId)`,
        {
            replacements: {
                hid,
                planId,
            },
            transaction,
        },
    );

    await sequelize.query(
        `INSERT INTO plan_shantytowns_history(
            fk_plan,
            fk_shantytown,
            created_by,
            created_at,
            updated_by,
            updated_at
        ) (SELECT
            :hid,
            fk_shantytown,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM plan_shantytowns
        WHERE fk_plan = :planId)`,
        {
            replacements: {
                hid,
                planId,
            },
            transaction,
        },
    );

    await sequelize.query(
        `INSERT INTO finances_history(
            fk_plan,
            year,
            closed,
            created_by,
            created_at,
            updated_by,
            updated_at
        ) (SELECT
            :hid,
            year,
            closed,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM finances
        WHERE fk_plan = :planId)`,
        {
            replacements: {
                hid,
                planId,
            },
            transaction,
        },
    );
    const financeHids = await sequelize.query(
        `SELECT
            finances_history.finance_id AS hid,
            finances.finance_id
        FROM finances_history
        LEFT JOIN finances ON (finances.fk_plan = :planId AND finances.year = finances_history.year)
        WHERE finances_history.fk_plan = :hid`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                hid,
                planId,
            },
            transaction,
        },
    );

    await Promise.all(
        financeHids.map(({ hid: financeHid, finance_id: financeId }) => sequelize.query(
            `INSERT INTO finance_rows_history(
                fk_finance,
                fk_finance_type,
                amount,
                real_amount,
                comments,
                created_by,
                created_at,
                updated_by,
                updated_at
            ) (SELECT
                :hid,
                fk_finance_type,
                amount,
                real_amount,
                comments,
                created_by,
                created_at,
                updated_by,
                updated_at
            FROM finance_rows
            WHERE fk_finance = :financeId)`,
            {
                replacements: {
                    hid: financeHid,
                    financeId,
                },
                transaction,
            },
        )),
    );

    return hid;
};
