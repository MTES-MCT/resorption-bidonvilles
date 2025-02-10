import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawParcel } from './RawParcel.d';
import { getAllowedSchemas, getAllowedTables } from '../common/getWhiteLists';

export default async (id: string, dept: string, schema: string, shortTableName: string, tableName: string): Promise<RawParcel> => {
    const currentYear = new Date().getFullYear();
    const ALLOWED_SCHEMAS = getAllowedSchemas(currentYear);
    const ALLOWED_TABLES = getAllowedTables(currentYear, dept, shortTableName);

    if (!ALLOWED_SCHEMAS.includes(schema) || !ALLOWED_TABLES.includes(tableName)) {
        return null;
    }

    const fullTableName = `"${schema}"."${tableName}"`;

    const parcelles: RawParcel[] = await sequelize.query(
        `SELECT idpar, idcom, dnupro, dnuvoi, cconvo, dvoilib, idcomtxt
            FROM ${fullTableName} fpp 
            WHERE fpp.idpar = :id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (parcelles.length !== 1) {
        return null;
    }

    return parcelles[0];
};
