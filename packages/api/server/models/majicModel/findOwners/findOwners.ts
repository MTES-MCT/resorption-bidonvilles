import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawOwner } from './RawOwner';
import { getAllowedSchemas, getAllowedTables } from '../common/getWhiteLists';

export default async (idcom: string, dnupro: string, dept: string, schema: string, shortTableName: string, tableName: string): Promise<RawOwner[]> => {
    const currentYear = new Date().getFullYear();
    const ALLOWED_SCHEMAS = getAllowedSchemas(currentYear);
    const ALLOWED_TABLES = getAllowedTables(currentYear, dept, shortTableName);

    if (!ALLOWED_SCHEMAS.includes(schema) || !ALLOWED_TABLES.includes(tableName)) {
        return null;
    }

    const fullTableName = `"${schema}"."${tableName}"`;

    const owners: RawOwner[] = await sequelize.query(
        `SELECT fpdna.ccodrotxt, fpdna.ccodemtxt, fpdna.dqualp, 
            fpdna.dnomus, fpdna.dprnus, fpdna.catpro2txt,
            fpdna.dlign3, fpdna.dlign4, fpdna.dlign5, fpdna.dlign6
            FROM ${fullTableName} fpdna
            WHERE fpdna.idcom= :idcom AND dnupro= :dnupro`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                idcom,
                dnupro,
            },
        },
    );

    if (owners.length < 1) {
        return null;
    }

    return owners;
};
