import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawParcel } from './RawParcel.d';
import getParcelTableName from '../common/getFullTableName';

export default async (id: string, dept: string, schema: string, shortTableName: string, tableName: string): Promise<RawParcel> => {
    const fullTableName = getParcelTableName(dept, schema, shortTableName, tableName);

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
