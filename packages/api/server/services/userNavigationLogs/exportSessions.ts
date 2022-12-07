
import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';
import moment from 'moment';

function serializeSession(user, session, beginning, duration) {
    return {
        'Id de l\'utilisateur': user,
        'Niveau géographique de l\'utilisateur': session.location_type,
        'Nom de la région': session.region_name,
        'Code de la région': session.region_code,
        'Nom du département': session.departement_name,
        'Code du département': session.departement_code,
        'Catégorie de structure de l\'utilisateur': session.organization_category,
        'Type de structure de l\'utilisateur': session.organization_type,
        'Rôle de l\'utilisateur': session.role,
        'Début de la session': moment(beginning).utcOffset(2).format('DD/MM/YYYY-HH:mm:ss'),
        'Durée de la session (en minutes)': Math.round(duration / 60000),
    };
}

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
            sessions.push(
                serializeSession(
                    currentUser,
                    logs[index - 1],
                    beginningOfSession,
                    durationOfSession,
                ),
            );

            currentUser = log.user_id;
            durationOfSession = 0;
            beginningOfSession = log.date;
        } else {
            durationOfSession = log.date - beginningOfSession;
        }
    });

    if (logs.length > 0) {
        sessions.push(
            serializeSession(
                currentUser,
                logs[logs.length - 1],
                beginningOfSession,
                durationOfSession,
            ),
        );
    }

    return sessions;
};
