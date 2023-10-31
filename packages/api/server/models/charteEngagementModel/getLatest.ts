import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import config from '#server/config';
import { RawCharteEngagement } from './getLatest.d';

const { backUrl } = config;
export default async (): Promise<RawCharteEngagement> => {
    const rows: RawCharteEngagement[] = await sequelize.query(
        `SELECT
            version,
            fichier
        FROM chartes_engagement
        ORDER BY version DESC
        LIMIT 1`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.length === 1
        ? {
            version: rows[0].version,
            fichier: `${backUrl}/assets/chartes_engagement/${rows[0].fichier}`,
        }
        : null;
};
