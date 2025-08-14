module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO shantytown_parcel_owners(fk_shantytown, fk_user, owner_name, fk_owner_type)
        SELECT
            shantytowns.shantytown_id,
            shantytowns.created_by,
            shantytowns.owner,
            shantytowns.fk_owner_type
        FROM shantytowns
        WHERE shantytowns.fk_owner_type IS NOT NULL AND shantytowns.status = 'open'
        `,
    ),

    down: queryInterface => queryInterface.sequelize.query('DELETE FROM shantytown_parcel_owners'),
};
