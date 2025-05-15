import { sequelize } from '#db/majicSequelize';
import { QueryTypes } from 'sequelize';

interface QueryResult {
    encryption_key: Buffer;
}

export default async () => {
    try {
        const [result] = await sequelize.query<QueryResult>(
            `SELECT 
                encode(
                    pg_read_binary_file('/secret/encryption-key')::bytea, 
                    'hex'
                ) AS encryption_key`,
            { type: QueryTypes.SELECT },
        );

        if (!result?.encryption_key) {
            throw new Error('Clé de chiffrement non trouvée');
        }

        return result.encryption_key;
    } catch (error) {
        console.error('Erreur lors de la récupération de la clé:', error);
        throw new Error('Impossible de récupérer la clé de chiffrement');
    }
};
