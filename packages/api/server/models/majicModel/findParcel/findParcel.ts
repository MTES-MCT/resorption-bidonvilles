import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawParcel } from './RawParcel.d';

export default async (id: string, schema: string, tableName: string): Promise<RawParcel> => {
    const parcelles: RawParcel[] = await sequelize.query(
        `SELECT idpar, idcom, dnupro, dnuvoi, cconvo, dvoilib, idcomtxt
            FROM ${schema}.${tableName} fpp 
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
