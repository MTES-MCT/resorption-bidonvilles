import IncomingWebhook from 'node-mattermost';
import config from '#server/config';
import Action from '#root/types/resources/Action.d';
import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { User } from '#root/types/resources/User.d';

const { mattermost, webappUrl } = config;
const formatAddress = (town: Shantytown): string => `${town.address} ${town.name ? `« ${town.name} » ` : ''}`;
const formatUsername = (user: { id: number, first_name: string, last_name: string }): string => `[${user.first_name} ${user.last_name}](${webappUrl}/nouvel-utilisateur/${user.id}) `;
const formatUsernameWithEmailLink = (user: { first_name: string, last_name: string, email: string, }): string => `[${user.first_name} ${user.last_name}](mailto:${user.email}) `;
const formatTownLink = (townID: number, text: string): string => `[${text}](${webappUrl}/site/${townID})`;
const formatActionLink = (actionID: number, text: string): string => `[${text}](${webappUrl}/action/${actionID})`;

const formatDate = ((dateToFormat: Date): string => {
    const day = dateToFormat.getDate();
    const month = dateToFormat.getMonth() + 1;
    const year = dateToFormat.getFullYear();
    return `${day}/${month}/${year}`;
});

async function triggerShantytownCloseAlert(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const shantytownCloseAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const userfullname = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const builtAtStr = formatDate(new Date(town.builtAt * 1000));
    const declaredAtStr = formatDate(new Date(town.declaredAt * 1000));
    const closedAtStr = formatDate(new Date(town.closedAt * 1000));
    const resorptionTarget = !town.resorptionTarget ? 'non' : town.resorptionTarget;

    const mattermostMessage = {
        channel: '#notif-fermeture-sites',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Fermeture de site: ${townLink} par ${userfullname}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: false,
                        value: `*Status* : ${town.closedWithSolutions && town.closedWithSolutions !== 'no' ? 'Résorbé' : 'Disparu'}`,
                    },
                    {
                        short: false,
                        value: `*Cause de la fermeture* : ${town.status}`,
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
            },
        ],
    };

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

    const mattermostMessage = {
        channel: '#notif-ouverture-sites',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Site ouvert ${townLink} par ${username}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
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
            }],
    };

    await shantytownCreationAlert.send(mattermostMessage);
}

async function triggerNewUserAlert(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newUserAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const usernameLink = `<${webappUrl}/nouvel-utilisateur/${user.id}|${username}>`;

    let locationText = 'Inconnu';
    if (user.intervention_areas.is_national) {
        locationText = 'National';
    } else {
        const area = user.intervention_areas.areas.find(a => a.is_main_area && a.type !== 'nation');
        if (area !== undefined) {
            locationText = area[area.type].name;
        }
    }

    const mattermostMessage = {
        channel: '#notif-nouveaux-utilisateurs',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Nouvel utilisateur: ${usernameLink} <${user.email}>`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
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
            },
        ],
    };

    await newUserAlert.send(mattermostMessage);
}

async function triggerActorInvitedAlert(town: Shantytown, host: User, invited: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const actorInvitedAlert = new IncomingWebhook(mattermost);
    const townLink = formatTownLink(town.id, town.usename);

    const username = formatUsername(host);
    const usernameLink = `<${webappUrl}/nouvel-utilisateur/${host.id}|${username}>`;

    const mattermostMessage = {
        channel: '#notif-invitations-intervenants',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Intervenant invité sur le site ${townLink} par ${usernameLink}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: false,
                        value: `*Personne invitée*: ${invited}`,
                    },
                ],
            }],
    };

    await actorInvitedAlert.send(mattermostMessage);
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
    const mattermostMessage = {
        channel: '#notif-nouveau-commentaire',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Commentaire sur le site: ${townLink} par ${username}`,
        attachments: [
            {
                color: '#f2c744',
                fields,
            },
        ],
    };

    await newCommentAlert.send(mattermostMessage);
}

async function triggerNewActionComment(comment: string, action: Action, author: CommentAuthor): Promise<void> {
    if (!mattermost) {
        return;
    }

    const newCommentAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(author);
    const actionLink = formatActionLink(action.id, action.name);

    const mattermostMessage = {
        channel: '#notif-action-nouveau-commentaire',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Commentaire sur l'action: ${actionLink} par ${username}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: false,
                        value: `*Commentaire*: ${comment}`,
                    },
                ],
            },
        ],
    };

    await newCommentAlert.send(mattermostMessage);
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

    const mattermostMessage = {
        // Don't initialize the channel name because the incoming webhook has been designed for this one
        channel: '#notif-personnes-invitées',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Personne invitée sur la plateforme par ${greeterName} ${msg ? msg : ''}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: 'false',
                        value: `*Personne invitée*: ${guestName}`,
                    },
                ],
            }],
    };

    await peopleInvitedAlert.send(mattermostMessage);
}

async function triggerDeclaredActor(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const declaredActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage = {
        channel: '#notif-intervenants-declares',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: ${username} s'est déclaré comme intervenant sur le site ${townLink}`,
        fields: [],
    };

    await declaredActor.send(mattermostMessage);
}

async function triggerInvitedActor(town: Shantytown, host: User, guest: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const invitedActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const hostUsername = formatUsername(host);
    const guestUsername = formatUsername(guest);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage = {
        channel: '#notif-intervenants-declares',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: ${hostUsername} a invité ${guestUsername} à se déclarer comme intervenant sur le site ${townLink}`,
        fields: [],
    };

    await invitedActor.send(mattermostMessage);
}

async function triggerRemoveDeclaredActor(town: Shantytown, user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const removeDeclaredActor = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage = {
        channel: '#notif-intervenants-declares',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: ${username} a cessé d'intervenir sur le site ${townLink}`,
        fields: [],
    };

    await removeDeclaredActor.send(mattermostMessage);
}

async function triggerNotifyNewUserFromRectorat(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const username = formatUsername(user);

    const mattermostMessage = {
        channel: '#tech',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: L'utilisateur(ice) ${username}, membre de Rectorat, a été créé(e). Merci de lui étendre ses droits d'accès à toute son académie`,
        fields: [],
    };

    await webhook.send(mattermostMessage);
}

async function triggerNotifyNewUserSelfDeactivation(user: User): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const username = formatUsername(user);

    const mattermostMessage = {
        channel: '#notif-auto-desactivations',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: L'utilisateur(ice) ${username} vient de désactiver son accès à la plateforme`,
        fields: [],
    };

    await webhook.send(mattermostMessage);
}

export async function triggerAttachmentArchiveCleanup(deleteRequestsCount: number, errorsCount: number): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const mattermostMessage = {
        channel: '#notif-nettoyage-piecesjointes',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Un nettoyage automatique des fichiers vient d'être effectué pour un total de ${deleteRequestsCount} fichiers à supprimer et ${errorsCount} erreurs rencontrées`,
        fields: [],
    };

    await webhook.send(mattermostMessage);
}

export async function triggerAttachmentArchiveCleanupError(): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const mattermostMessage = {
        channel: '#notif-nettoyage-piecesjointes',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: ':rotating_light: Une erreur est survenue lors du DELETE en base de données',
        fields: [],
    };

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

    const mattermostMessage = {
        channel: '#notif-anonymisation',
        username: 'Information Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: ':rotating_light: Une anonymisation automatique des propriétaires vient d\'être lancée:',
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: false,
                        value: `*${shantytownLinesMessage} ${shantytownLines > 1 ? ' traitées ' : ' traitée '} dans la table des sites`,
                    },
                    {
                        short: false,
                        value: `*${shantytownHistoryLinesMessage} ${shantytownHistoryLines > 1 ? ' traitées ' : ' traitée '} dans l'historique des sites`,
                    },
                ],
            },
        ],
    };

    await webhook.send(mattermostMessage);
}

export async function triggerNotifyOwnersAnonymizationError(message: string): Promise<void> {
    if (!mattermost) {
        return;
    }

    const webhook = new IncomingWebhook(mattermost);
    const mattermostMessage = {
        channel: '#notif-anonymisation',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: ':rotating_light: Une erreur est survenue lors de l\'anonymisation des propriétaires en base de données',
        attachments: [
            {
                color: '#d63232',
                fields: [
                    {
                        short: false,
                        value: `*Erreur: * ${message}`,
                    },
                ],
            },
        ],
    };

    await webhook.send(mattermostMessage);
}

export default {
    triggerShantytownCloseAlert,
    triggerShantytownCreationAlert,
    triggerNewUserAlert,
    triggerActorInvitedAlert,
    triggerAttachmentArchiveCleanup,
    triggerAttachmentArchiveCleanupError,
    triggerPeopleInvitedAlert,
    triggerNewComment,
    triggerNewActionComment,
    triggerDeclaredActor,
    triggerInvitedActor,
    triggerRemoveDeclaredActor,
    triggerNotifyNewUserFromRectorat,
    triggerNotifyNewUserSelfDeactivation,
    triggerNotifyOwnersAnonymization,
    triggerNotifyOwnersAnonymizationError,
};
