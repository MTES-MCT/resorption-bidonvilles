const {
    send: sendMail,
    PRESERVE_RECIPIENT,
} = require('#server/services/mailService');
const { triggerPeopleInvitedAlert } = require('#server/utils/slack');
const { slack: slackConfig } = require('#server/config');

const sendEmailsInvitations = async (guests, greeter) => {
    for (let i = 0; i < guests.length; i += 1) {
        const guest = {
            first_name: guests[i].first_name,
            last_name: guests[i].last_name,
            email: guests[i].email,
        };

        try {
            // eslint-disable-next-line no-await-in-loop
            await sendMail('invitation', guest, null, [guest, greeter], PRESERVE_RECIPIENT);
        } catch (err) {
            // Ignore
        }
    }
};

const sendSlackNotifications = async (guests, greeter) => {
    if (!slackConfig || !slackConfig.invite_people) {
        return;
    }

    for (let i = 0; i < guests.length; i += 1) {
        // Send a slack alert, if it fails, do nothing
        try {
            // eslint-disable-next-line no-await-in-loop
            await triggerPeopleInvitedAlert(guests[i], greeter, "via le formulaire de demande d'accès");
        } catch (err) {
            console.log(`Error with invited people webhook : ${err.message}`);
        }
    }
};


module.exports = () => ({
    async invite(req, res, next) {
        const { greeter_full: greeter } = req;
        const { guests } = req.body;

        // Send an email to each guest
        try {
            await sendEmailsInvitations(guests, greeter);
        } catch (err) {
            res.status(500).send({
                error: {
                    developer_message: 'Invitations could not be sent',
                    user_message: 'Impossible d\'envoyer les invitations',
                },
            });
            return next(err);
        }

        // Send a slack alert for each guest
        try {
            await sendSlackNotifications(guests, greeter);
        } catch (err) {
            // ignore
        }

        return res.status(200).send({});
    },
});
