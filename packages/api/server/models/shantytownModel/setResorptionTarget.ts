import { sequelize } from '#db/sequelize';

export default async function setResorptionTarget(shantytownId: number, resorptionTarget: number) {
    await sequelize.query(
        `UPDATE shantytowns
        SET 
            resorption_target = :resorption_target
        WHERE shantytown_id = :id`,
        {
            replacements: {
                id: shantytownId,
                resorption_target: resorptionTarget,
            },
        },
    );
}
