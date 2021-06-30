
const MatterMostClient = require('node-mattermost');
const { mattermost } = require('#server/config');

const formatUsername = user => `${user.first_name} ${user.last_name} `;

async function triggerPeopleInvitedAlert(guest, greeter, msg) {
    if (!mattermost || !mattermost.invite_people) {
        return;
    }

    const peopleInvitedAlert = new MatterMostClient(mattermost.invite_people);

    const guestName = formatUsername(guest);
    const greeterName = formatUsername(greeter);

    const mattermostMessage = {
        username: 'Alerte Résorption Bidonvilles',
        icon_emoji: ':robot:',
        text: `Nouvel intervenant invité : ${guestName}`,
        attachments: [
            {
                color: '#f2c744',
                fields: [
                    {
                        short: 'false',
                        title: `:rotating_light: Personne invitée sur la plateforme par ${greeterName} ${msg}`,
                        value: `Personne invitée : ${guestName} <${guest.email}>`,
                    },
                ],
            }],
    };

    await peopleInvitedAlert.send(mattermostMessage);
}

module.exports = {
    triggerPeopleInvitedAlert,
};
