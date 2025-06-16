import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';

type MajicYear = {
    majicyear: string,
};

export default async (): Promise<string> => {
    const majicYears: MajicYear[] = await sequelize.query(
        `SELECT SUBSTR(schema_name, 3, 4) AS majicyear
        FROM information_schema.schemata
        WHERE schema_name ilike '%ff%';`,
        {
            type: QueryTypes.SELECT,
        },
    );

    if (majicYears.length < 1) {
        return null;
    }
    return majicYears[0].majicyear;
};
