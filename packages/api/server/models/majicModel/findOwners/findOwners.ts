import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';
import { RawOwner } from './RawOwner';
import getOwnersTableName from '../common/getFullTableName';

export default async (idcom: string, dnupro: string, dept: string, schema: string, shortTableName: string, tableName: string): Promise<RawOwner[] | null> => {
    const baseTableName = getOwnersTableName(dept, schema, shortTableName, tableName);

    if (!baseTableName) {
        throw new Error(`Impossible de construire le nom de la table des propriétaires pour le département ${dept}`);
    }

    const fullTableName = `${baseTableName}_encrypted`;


    let owners: RawOwner[];
    try {
        owners = await sequelize.query(
            `WITH key_data AS (
                SELECT 
                    encode(
                        pg_read_binary_file('/secret/encryption-key'), 
                        'hex'
                    ) AS encryption_key
            )
            SELECT 
                fpdna.ccodrotxt,
                fpdna.ccodemtxt,
                fpdna.dqualp,
                pgp_sym_decrypt(fpdna.dnomus::bytea, encryption_key) AS dnomus,
                pgp_sym_decrypt(fpdna.dprnus::bytea, encryption_key) AS dprnus,
                fpdna.catpro2txt,
                pgp_sym_decrypt(fpdna.dlign3::bytea, encryption_key) AS dlign3,
                pgp_sym_decrypt(fpdna.dlign4::bytea, encryption_key) AS dlign4,
                pgp_sym_decrypt(fpdna.dlign5::bytea, encryption_key) AS dlign5,
                pgp_sym_decrypt(fpdna.dlign6::bytea, encryption_key) AS dlign6
            FROM
                ${fullTableName} fpdna,
                key_data
            WHERE
                fpdna.idcom= :idcom
            AND
                dnupro= :dnupro`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    idcom,
                    dnupro,
                },
            },
        );
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des propriétaires: ${error?.message || 'Erreur inconnue'}`);
    }

    if (owners.length < 1) {
        return null;
    }

    return owners;
};
