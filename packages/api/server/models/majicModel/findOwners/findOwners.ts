import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawOwner } from './RawOwner';
import getOwnersTableName from '../common/getFullTableName';

export default async (idcom: string, dnupro: string, dept: string, schema: string, shortTableName: string, tableName: string): Promise<RawOwner[]> => {
    const fullTableName = getOwnersTableName(dept, schema, shortTableName, tableName);

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
