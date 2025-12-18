import IncomingWebhook from 'node-mattermost';
import config from '#server/config';
import statusDetails from '#server/utils/statusDetails';
import Action from '#root/types/resources/Action.d';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { User } from '#root/types/resources/User.d';

type MattermostMsg = {
    channel: string | null;
    username: string;
    icon_emoji: string;
    text: string;
    attachments?: {
        color: string;
        fields: { short: boolean; value: string }[];
    }[];
};

const { mattermost, webappUrl } = config;
const formatAddress = (town: Shantytown): string => `${town.address} ${town.name ? `« ${town.name} » ` : ''}`;
const formatUsername = (user: { id: number, first_name: string, last_name: string }): string => `[${user.first_name} ${user.last_name}](${webappUrl}/nouvel-utilisateur/${user.id}) `;
const formatUsernameWithEmailLink = (user: { first_name: string, last_name: string, email: string, }): string => `[${user.first_name} ${user.last_name}](mailto:${user.email}) `;
const formatTownLink = (townID: number, text: string): string => `[${text}](${webappUrl}/site/${townID})`;
const formatActionLink = (actionID: number, text: string): string => `[${text}](${webappUrl}/action/${actionID})`;

const checkLocation: (user: User) => string = (user) => {
    let locationText: string = 'Inconnu';
    if (user.intervention_areas.is_national) {
        locationText = 'National';
    } else {
        const area = user.intervention_areas.areas.find(a => a.is_main_area && a.type !== 'nation');
        if (area !== undefined) {
            locationText = area[area.type].name;
        }
    }
    return locationText;
};

const formatDate = ((dateToFormat: Date): string => {
    const day = String(dateToFormat.getUTCDate()).padStart(2, '0');
    const month = String(dateToFormat.getUTCMonth() + 1).padStart(2, '0');
    const year = dateToFormat.getUTCFullYear();
    return `${day}/${month}/${year}`;
});

const formatTownStatus = (status: string): string => {
    const statusMapping: { [key: string]: string } = statusDetails;
    return statusMapping[status] || status;
};

const buildMattermostMessage = (channel: string, text: string, color: string, fields: { short: boolean, value: string }[]): MattermostMsg => ({
    channel,
    username: 'Alerte Résorption Bidonvilles',
    icon_emoji: ':robot:',
    text,
    attachments: [
        {
            color,
            fields,
        },
    ],
});

async function triggerActorInvitedAlert(town: Shantytown, host: User, invited: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const actorInvitedAlert = new IncomingWebhook(mattermost);
    const townLink = formatTownLink(town.id, town.usename);

    const username = formatUsername(host);
    const usernameLink = `<${webappUrl}/nouvel-utilisateur/${host.id}|${username}>`;

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-invitations-intervenants',
        `:rotating_light: Intervenant invité sur le site ${townLink} par ${usernameLink}`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Personne invitée*: ${invited}`,
            },
        ],
    );

    await actorInvitedAlert.send(mattermostMessage);
}

export async function triggerAttachmentArchiveCleanup(deleteRequestsCount: number, errorsCount: number): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-nettoyage-piecesjointes',
        `:rotating_light: Un nettoyage automatique des fichiers vient d'être effectué pour un total de ${deleteRequestsCount} fichiers à supprimer et ${errorsCount} erreurs rencontrées`,
        '#f2c744',
        [],
    );

    await webhook.send(mattermostMessage);
}

export async function triggerAttachmentArchiveCleanupError(): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-nettoyage-piecesjointes',
        ':rotating_light: Une erreur est survenue lors du DELETE en base de données',
        '#d63232',
        [],
    );

    await webhook.send(mattermostMessage);
}

async function triggerDeclaredActor(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const declaredActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-intervenants-declares',
        `:rotating_light: ${username} s'est déclaré comme intervenant sur le site ${townLink}`,
        ':robot:',
        [],
    );

    await declaredActor.send(mattermostMessage);
}

const triggerHeatwaveStatusChange = async (user: User, town: Shantytown, heatwaveStatus: boolean): Promise<void> => {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const usernameLink = `<${webappUrl}/acces/${user.id}|${username}>`;

    const alertColor: string = heatwaveStatus === true ? '#d63232' : '#f2c744';
    const alertStatus: string = heatwaveStatus === true ? '**activée** :high_brightness:' : '**désactivée** :negative_squared_cross_mark:';
    const organizationAbbreviation: string = user.organization.abbreviation ? `(${user.organization.abbreviation})` : '';
    const notifChannel: string = `#notif-canicule${config.environnement === 'development' ? '-test' : ''}`;

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        notifChannel,
        `:thermometer: Une alerte canicule a été ${alertStatus} par ${usernameLink} <${user.email}>`,
        alertColor,
        [
            {
                short: false,
                value: `*Site*: ${formatTownLink(town.id, town.usename)} *(ID du site: #${town.id})*`,
            },
            {
                short: false,
                value: `*Organisation*: ${user.organization.name}${organizationAbbreviation}`,
            },
            {
                short: false,
                value: `*Rôle*: ${user.position}`,
            },
            {
                short: false,
                value: `*Statut de l'alerte*: ${alertStatus}`,
            },
        ],
    );

    await webhook.send(mattermostMessage);
};

async function triggerInvitedActor(town: Shantytown, host: User, guest: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const invitedActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const hostUsername = formatUsername(host);
    const guestUsername = formatUsername(guest);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-intervenants-declares',
        `:rotating_light: ${hostUsername} a invité ${guestUsername} à se déclarer comme intervenant sur le site ${townLink}`,
        '#f2c744',
        [],
    );

    await invitedActor.send(mattermostMessage);
}

async function triggerLandRegistryRequest(user: User, parcel: string, dataYear: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newLandRegistryEnquiryAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const usernameLink = `<${webappUrl}/acces/${user.id}|${username}>`;

    const locationText = checkLocation(user);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-requetes-cadastre',
        `:world_map: Demande d'information cadastre de: ${usernameLink} <${user.email}>`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Territoire de rattachement*: ${locationText}`,
            },
            {
                short: false,
                value: `*Organisation*: ${user.organization.name}`,
            },
            {
                short: false,
                value: `*Fonction*: ${user.position}`,
            },
            {
                short: false,
                value: `*Parcelle concernée*: ${parcel}`,
            },
            {
                short: false,
                value: `*Millésime des données du cadastre*: ${dataYear}`,
            },
        ],
    );

    await newLandRegistryEnquiryAlert.send(mattermostMessage);
}

async function triggerNewActionComment(comment: string, action: Action, author: CommentAuthor): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newCommentAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(author);
    const actionLink = formatActionLink(action.id, action.name);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-action-nouveau-commentaire',
        `:rotating_light: Commentaire sur l'action: ${actionLink} par ${username}`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Commentaire*: ${comment}`,
            },
        ],
    );

    await newCommentAlert.send(mattermostMessage);
}

async function triggerNewComment(commentDescription: string, tagLabels: string[], town: Shantytown, author: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newCommentAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(author);
    const townLink = formatTownLink(town.id, address);

    const fields = [{
        short: false,
        value: `*Commentaire*: ${commentDescription}`,
    }];

    if (tagLabels.length > 0) {
        fields.push({
            short: false,
            value: `*Qualification${tagLabels.length > 1 ? 's' : ''} du commentaire*: ${tagLabels.join(', ')}.`,
        });
    }

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-nouveau-commentaire',
        `:rotating_light: Commentaire sur le site: ${townLink} par ${username}`,
        '#f2c744',
        fields,
    );

    await newCommentAlert.send(mattermostMessage);
}

async function triggerNewUserAlert(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newUserAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const usernameLink = `<${webappUrl}/nouvel-utilisateur/${user.id}|${username}>`;

    const locationText = checkLocation(user);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-nouveaux-utilisateurs',
        `:rotating_light: Nouvel utilisateur: ${usernameLink} <${user.email}>`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Territoire de rattachement*: ${locationText}`,
            },
            {
                short: false,
                value: `*Organisation*: ${user.organization.name}`,
            },
            {
                short: false,
                value: `*Fonction*: ${user.position}`,
            },
        ],
    );

    await newUserAlert.send(mattermostMessage);
}

async function triggerNotifyNewUserFromRectorat(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const username = formatUsername(user);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#tech',
        `:rotating_light: L'utilisateur(ice) ${username}, membre de Rectorat, a été créé(e). Merci de lui étendre ses droits d'accès à toute son académie`,
        '#f2c744',
        [],
    );

    await webhook.send(mattermostMessage);
}

async function triggerNotifyNewUserSelfDeactivation(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const username = formatUsername(user);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-auto-desactivations',
        `:rotating_light: L'utilisateur(ice) ${username} vient de désactiver son accès à la plateforme`,
        '#f2c744',
        [],
    );

    await webhook.send(mattermostMessage);
}

async function triggerNotifyOwnersAnonymization(shantytownLines: number, shantytownHistoryLines: number): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);

    const createLinesMessage = (count: number): string => {
        if (count <= 0) {
            return 'Aucune ligne';
        }
        return count === 1 ? `${count} ligne` : `${count} lignes`;
    };

    const shantytownLinesMessage = createLinesMessage(shantytownLines);
    const shantytownHistoryLinesMessage = createLinesMessage(shantytownHistoryLines);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-anonymisation',
        ':rotating_light: Une anonymisation automatique des propriétaires vient d\'être lancée:',
        '#f2c744',
        [
            {
                short: false,
                value: `*${shantytownLinesMessage} ${shantytownLines > 1 ? ' traitées ' : ' traitée '} dans la table des sites`,
            },
            {
                short: false,
                value: `*${shantytownHistoryLinesMessage} ${shantytownHistoryLines > 1 ? ' traitées ' : ' traitée '} dans l'historique des sites`,
            },
        ],
    );

    await webhook.send(mattermostMessage);
}

export async function triggerNotifyOwnersAnonymizationError(message: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-anonymisation',
        ':rotating_light: Une erreur est survenue lors de l\'anonymisation des propriétaires en base de données',
        '#d63232',
        [
            {
                short: false,
                value: `*Erreur: * ${message}`,
            },
        ],
    );

    await webhook.send(mattermostMessage);
}

async function triggerPeopleInvitedAlert(guest: User, greeter: User, msg: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const peopleInvitedAlert = new IncomingWebhook(mattermost);

    const guestName = formatUsernameWithEmailLink(guest);

    let greeterName = '';
    if (greeter.id) {
        greeterName = formatUsername(greeter);
    } else {
        greeterName = formatUsernameWithEmailLink(greeter);
    }

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        null,
        `:rotating_light: Personne invitée sur la plateforme par ${greeterName} ${msg || ''}`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Personne invitée*: ${guestName}`,
            },
        ],
    );

    await peopleInvitedAlert.send(mattermostMessage);
}

async function triggerRemoveDeclaredActor(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const removeDeclaredActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-intervenants-declares',
        `:rotating_light: ${username} a cessé d'intervenir sur le site ${townLink}`,
        '#f2c744',
        [],
    );

    await removeDeclaredActor.send(mattermostMessage);
}

async function triggerRequestActionPilot(action: EnrichedAction, user: User): Promise<boolean> {
    if (!mattermost) {
        return false;
    }
    const notifChannel: string = config.environnement === 'development' ? '#notif-dev-test' : '#notif-absence-pilote-action';
    const requestActionPilot = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const actionLink = formatActionLink(action.id, action.name);

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        notifChannel,
        `:question: ${username} a demandé un pilote pour l'action ${actionLink}`,
        '#f2c744',
        [],
    );
    await requestActionPilot.send(mattermostMessage);
    return true;
}

async function triggerShantytownCloseAlert(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const shantytownCloseAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const userfullname = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const builtAtStr = town.builtAt ? formatDate(new Date(town.builtAt * 1000)) : 'Non renseignée';
    const declaredAtStr = formatDate(new Date(town.declaredAt * 1000));
    const closedAtStr = formatDate(new Date(town.closedAt * 1000));

    const townStatus = formatTownStatus(town.status);

    const resorptionTarget = !town.resorptionTarget ? 'non' : town.resorptionTarget;

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-fermeture-sites',
        `:rotating_light: Fermeture de site: ${townLink} par ${userfullname}`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Statut* : ${town.closedWithSolutions && town.closedWithSolutions !== 'no' ? 'Résorbé' : 'Disparu'}`,
            },
            {
                short: false,
                value: `*Cause de la fermeture* : ${townStatus}`,
            },
            {
                short: false,
                value: `*Nombre d'habitants* : ${town.populationTotal || 'Nombre inconnu'}`,
            },
            {
                short: false,
                value: `*Date d'installation du site* : ${builtAtStr}`,
            },
            {
                short: false,
                value: `*Date de signalement du site* : ${declaredAtStr}`,
            },
            {
                short: false,
                value: `*Date de fermeture du site* : ${closedAtStr}`,
            },
            {
                short: false,
                value: `*Site avec objectif résorption* : ${resorptionTarget}`,
            },
        ],
    );

    await shantytownCloseAlert.send(mattermostMessage);
}

export async function triggerShantytownCreationAlert(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const shantytownCreationAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    let incomingTownsMessage = 'Aucun site n\'a été désigné comme origine de la réinstallation';
    if (town.reinstallationIncomingTowns.length > 0) {
        incomingTownsMessage = [
            'Le(s) site(s) suivant(s) ont été désigné(s) comme origine de la réinstallation :',
            '\n\n- ',
            town.reinstallationIncomingTowns.map(({ id, usename }) => formatTownLink(id, usename)).join('\n- '),
        ].join('');
    }

    const mattermostMessage: MattermostMsg = buildMattermostMessage(
        '#notif-ouverture-sites',
        `:rotating_light: Site ouvert ${townLink} par ${username}`,
        '#f2c744',
        [
            {
                short: false,
                value: `*Nombre d'habitants* : ${town.populationTotal || 'Nombre inconnu'}`,
            },
            {
                short: false,
                value: `*Date d'installation du site* : ${formatDate(new Date(town.builtAt * 1000))}`,
            },
            {
                short: false,
                value: `*Date de signalement du site* : ${formatDate(new Date(town.declaredAt * 1000))}`,
            },
            {
                short: false,
                value: incomingTownsMessage,
            },
        ],
    );

    await shantytownCreationAlert.send(mattermostMessage);
}

export default {
    triggerActorInvitedAlert,
    triggerAttachmentArchiveCleanup,
    triggerAttachmentArchiveCleanupError,
    triggerDeclaredActor,
    triggerHeatwaveStatusChange,
    triggerInvitedActor,
    triggerLandRegistryRequest,
    triggerNewActionComment,
    triggerNewComment,
    triggerNewUserAlert,
    triggerNotifyNewUserFromRectorat,
    triggerNotifyNewUserSelfDeactivation,
    triggerNotifyOwnersAnonymization,
    triggerNotifyOwnersAnonymizationError,
    triggerPeopleInvitedAlert,
    triggerRemoveDeclaredActor,
    triggerRequestActionPilot,
    triggerShantytownCloseAlert,
    triggerShantytownCreationAlert,
};
