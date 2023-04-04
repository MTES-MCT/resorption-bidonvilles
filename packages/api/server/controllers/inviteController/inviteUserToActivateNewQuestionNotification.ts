import mailsUtils from '#server/mails/mails';
import userModel from '#server/models/userModel';

const { sendUserInvitationToActivateNewQuestionNotification } = mailsUtils;
async function sendUsersInvitationToActivateNewQuestionNotification(guests) {
    for (let i = 0; i < guests.length; i += 1) {
        const guest = {
            first_name: guests[i].first_name,
            last_name: guests[i].last_name,
            email: guests[i].email,
        };

        try {
            // eslint-disable-next-line no-await-in-loop
            await sendUserInvitationToActivateNewQuestionNotification(guest);
        } catch (err) {
            // do nothing
        }
    }
}

export default async (req, res, next) => {
    const guests = await userModel.getSimplifiedActiveUsers();

    // Send an email to each guest
    try {
        await sendUsersInvitationToActivateNewQuestionNotification(guests);
    } catch (err) {
        res.status(500).send({
            error: {
                user_message: 'Impossible d\'envoyer les invitations',
            },
        });
        return next(err);
    }

    return res.status(200).send({});
};
