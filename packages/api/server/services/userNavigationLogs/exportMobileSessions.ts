
import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';
import { MobileSessionRow } from '#server/models/userNavigationLogsModel/getAllForMobileSessions';
import moment from 'moment';

type SerializedMobileSession = {
    'Id de l\'utilisateur': number,
    'Niveau géographique de l\'utilisateur': string,
    'Nom de la région': string | null,
    'Code de la région': string | null,
    'Nom du département': string | null,
    'Code du département': string | null,
    'Catégorie de structure de l\'utilisateur': string,
    'Type de structure de l\'utilisateur': string,
    'Rôle de l\'utilisateur': string,
    'Début de la session': string,
    'Durée de la session (en minutes)': number,
    'Nombre de fiches sites différentes consultées': number,
    'Nombre de notes créées': number,
    'Nombre de notes différentes consultées': number,
    'Nombre de publications de notes': number,
};

function serializeSession(user: number, session: MobileSessionRow, beginning: Date, duration: number, townViews: number, noteCreations: number, noteViews: number, notePublications: number): SerializedMobileSession {
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
        'Nombre de fiches sites différentes consultées': townViews,
        'Nombre de notes créées': noteCreations,
        'Nombre de notes différentes consultées': noteViews,
        'Nombre de publications de notes': notePublications,
    };
}

const noteRegExp = new RegExp(/(?<=\/notes\/).*/);
const townRegExp = new RegExp(/(?<=\/site\/)\d+/);

export default async (): Promise<SerializedMobileSession[]> => {
    let logs: MobileSessionRow[];
    try {
        logs = await userNavigationLogsModel.getAllForMobileSessions();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const sessions: SerializedMobileSession[] = [];
    let currentUser: number = logs[0].user_id;
    let beginningOfSession: Date = logs[0].date;
    let durationOfSession: number = 0;

    let townViews: string[] = [];
    let noteViews: string[] = [];
    let noteCreations: number = 0;
    let notePublications: number = 0;

    // La liste des logs est triée par utilisateur, puis date
    logs.forEach((log, index) => {
        if (log.user_id !== currentUser || log.date.getTime() - beginningOfSession.getTime() > 3600000) {
            // si on change d'utilisateur ou que la session dépasse l'heure,
            // on commence une nouvelle session
            sessions.push(
                serializeSession(
                    currentUser,
                    logs[index - 1],
                    beginningOfSession,
                    durationOfSession,
                    townViews.length,
                    noteCreations,
                    noteViews.length,
                    notePublications,
                ),
            );

            currentUser = log.user_id;
            durationOfSession = 0;
            beginningOfSession = log.date;
            townViews = [];
            noteViews = [];
            noteCreations = 0;
            notePublications = 0;
        } else {
            durationOfSession = log.date.getTime() - beginningOfSession.getTime();
            const noteId = log.action.match(noteRegExp);
            const townId = log.action.match(townRegExp);

            if (log.action === 'creationNote') {
                noteCreations += 1;
            } else if (log.action === 'publicationNote') {
                notePublications += 1;
            } else if (townId && !townViews.includes(townId[0])) {
                townViews.push(townId[0]);
            } else if (noteId && !noteViews.includes(noteId[0])) {
                noteViews.push(noteId[0]);
            }
        }
    });

    if (logs.length > 0) {
        sessions.push(
            serializeSession(
                currentUser,
                logs[logs.length - 1],
                beginningOfSession,
                durationOfSession,
                townViews.length,
                noteCreations,
                noteViews.length,
                notePublications,
            ),
        );
    }

    return sessions;
};
