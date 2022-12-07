
import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';
import moment from 'moment';

export default async (domain: 'webapp' | 'mobile'): Promise<Array<Object>> => {
    let logs;
    try {
        logs = await userNavigationLogsModel.getAllForSessions(
            domain,
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const sessions = [];
    let currentUser = logs[0].user_id;
    let beginningOfSession = logs[0].date;
    let durationOfSession = 0;

    // La liste des logs est triée par utilisateur, puis date
    logs.forEach((log, index) => {
        if (log.user_id !== currentUser || log.date - beginningOfSession > 3600000) {
            // si on change d'utilisateur ou que la session dépasse l'heure,
            // on commence une nouvelle session
            sessions.push({
                'Id de l\'utilisateur': currentUser,
                'Niveau géographique de l\'utilisateur': logs[index - 1].location_type,
                'Nom de la région': logs[index - 1].region_name,
                'Code de la région': logs[index - 1].region_code,
                'Nom du département': logs[index - 1].departement_name,
                'Code du département': logs[index - 1].departement_code,
                'Catégorie de structure de l\'utilisateur': logs[index - 1].organization_category,
                'Type de structure de l\'utilisateur': logs[index - 1].organization_type,
                'Rôle de l\'utilisateur': logs[index - 1].role,
                'Début de la session': moment(beginningOfSession).utcOffset(2).format('DD/MM/YYYY-HH:mm:ss'),
                'Durée de la session (en minutes)': Math.round(durationOfSession / 60000),
            });
            currentUser = log.user_id;
            durationOfSession = 0;
            beginningOfSession = log.date;
        } else {
            durationOfSession = log.date - beginningOfSession;
        }
    });
    const lastSession = logs[logs.length - 1];
    sessions.push({
        'Id de l\'utilisateur': currentUser,
        'Niveau géographique de l\'utilisateur': lastSession.location_type,
        'Nom de la région': lastSession.region_name,
        'Code de la région': lastSession.region_code,
        'Nom du département': lastSession.departement_name,
        'Code du département': lastSession.departement_code,
        'Catégorie de structure de l\'utilisateur': lastSession.organization_category,
        'Type de structure de l\'utilisateur': lastSession.organization_type,
        'Rôle de l\'utilisateur': lastSession.role,
        'Début de la session': moment(beginningOfSession).utcOffset(2).format('DD/MM/YYYY-HH:mm:ss'),
        'Durée de la session (en minutes)': Math.round(durationOfSession / 60000),
    });
    return sessions;
};
