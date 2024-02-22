import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        organization_type_id AS id,
        name_singular,
        name_plural,
        abbreviation,
        fk_category AS organization_category
    FROM organization_types`,
    {
        type: QueryTypes.SELECT,
    },
);
