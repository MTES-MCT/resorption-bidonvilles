import { sequelize } from '#db/sequelize';

/**
 * Supprime les logs de connexion de plus de 30 jours
 *
 * Cette fonction est exécutée automatiquement par un job Agenda planifié
 * pour nettoyer régulièrement les anciens logs et limiter la croissance de la table.
 */
export default async (): Promise<{ deletedCount: number }> => {
    const retentionDays = 30;

    try {
        const [, metadata] = await sequelize.query(
            `DELETE FROM signin_logs 
             WHERE attempted_at < NOW() - INTERVAL '${retentionDays} days'`,
        );

        const deletedCount = (metadata as any).rowCount || 0;

        // eslint-disable-next-line no-console
        console.log(`[purgeOldLogs] ${deletedCount} signin log(s) older than ${retentionDays} days have been deleted`);

        return { deletedCount };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[purgeOldLogs] Failed to purge old signin logs:', error);
        throw error;
    }
};
