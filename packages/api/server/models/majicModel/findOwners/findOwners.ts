import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawOwner } from './RawOwner';

export default async (idcom: string, dnupro: string, schema: string, tableName: string): Promise<RawOwner[]> => {
    const owners: RawOwner[] = await sequelize.query(
        `SELECT fpdna.ccodrotxt, fpdna.ccodemtxt, fpdna.dqualp, 
            fpdna.dnomus, fpdna.dprnus, fpdna.catpro2txt,
            fpdna.dlign3, fpdna.dlign4, fpdna.dlign5, fpdna.dlign6
            FROM ${schema}.${tableName} fpdna
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
