import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Departement } from '#root/types/resources/Departement.d';

export default (): Promise<Departement[]> => sequelize.query(
    `SELECT
        departements.code AS code,
        departements.name AS name,
        departements.fk_region AS region
    FROM departements
    ORDER BY code ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
