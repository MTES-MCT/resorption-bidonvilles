const sequelize = require('#db/sequelize');

module.exports = (shantytownId, heatwaveStatus) => {
    sequelize.query(
        `UPDATE shantytowns
        SET 
            heatwave_status = :heatwave_status
        WHERE shantytown_id = :id`,
        {
            replacements: {
                id: shantytownId,
                heatwave_status: heatwaveStatus,
            },

        },
    );
};
