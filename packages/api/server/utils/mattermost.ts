import IncomingWebhook from 'node-mattermost';
import config from '#server/config';

const { mattermost, webappUrl } = config;

const formatAddress = town => `${town.address} ${town.name ? `« ${town.name} » ` : ''}`;
const formatUsername = user => `${user.first_name} ${user.last_name} `;
const formatTownLink = (townID, text) => `[${text}](${webappUrl}/site/${townID})`;

const formatDate = ((dateToFormat) => {
    const day = dateToFormat.getDate();
    const month = dateToFormat.getMonth() + 1;
    const year = dateToFormat.getFullYear();
    return `${day}/${month}/${year}`;
});

async function triggerShantytownCloseAlert(town, user) {
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
                        value: `*Cause de la disparition* : ${town.status}`,
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

async function triggerShantytownCreationAlert(town, user) {
    const shantytownCreationAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(user);
    const townLink = formatTownLink(town.id, address);

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

                ],
            }],
    };

    await shantytownCreationAlert.send(mattermostMessage);
}

async function triggerNewUserAlert(user) {
    const newUserAlert = new IncomingWebhook(mattermost);

    const username = formatUsername(user);
    const usernameLink = `<${webappUrl}/nouvel-utilisateur/${user.id}|${username}>`;

    const { location } = user.organization;

    let locationText = 'Inconnu';
    if (location && location.type === 'nation') {
        locationText = 'National';
    } else if (location && location[location.type] !== null) {
        locationText = location[location.type].name;
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

async function triggerActorInvitedAlert(town, host, invited) {
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

async function triggerNewComment(comment, town, author) {
    if (!mattermost) {
        return;
    }

    const newCommentAlert = new IncomingWebhook(mattermost);

    const address = formatAddress(town);
    const username = formatUsername(author);
    const townLink = formatTownLink(town.id, address);

    const mattermostMessage = {
        channel: '#notif-nouveau-commentaire',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Commentaire sur le site: ${townLink} par ${username}`,
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

async function triggerPeopleInvitedAlert(guest, greeter, msg) {
    if (!mattermost) {
        return;
    }

    const peopleInvitedAlert = new IncomingWebhook(mattermost);

    const guestName = formatUsername(guest);
    const greeterName = formatUsername(greeter);

    const mattermostMessage = {
        // Don't initialize the channel name because the incoming webhook has been designed for this one
        // channel: '#notif-personnes-invitées',
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `:rotating_light: Personne invitée sur la plateforme par ${greeterName} ${msg}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: 'false',
                        value: `*Personne invitée*: ${guestName} <${guest.email}>`,
                    },
                ],
            }],
    };

    await peopleInvitedAlert.send(mattermostMessage);
}

async function triggerDeclaredActor(town, user) {
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

async function triggerInvitedActor(town, host, guest) {
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

async function triggerRemoveDeclaredActor(town, user) {
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


export default {
    triggerShantytownCloseAlert,
    triggerShantytownCreationAlert,
    triggerNewUserAlert,
    triggerActorInvitedAlert,
    triggerPeopleInvitedAlert,
    triggerNewComment,
    triggerDeclaredActor,
    triggerInvitedActor,
    triggerRemoveDeclaredActor,
};
