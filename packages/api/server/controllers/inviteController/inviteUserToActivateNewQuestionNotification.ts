import mailsUtils from '#server/mails/mails';
import userModel from '#server/models/userModel';
import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';


const { sendUserInvitationToActivateNewQuestionNotification } = mailsUtils;
async function sendUsersInvitationToActivateNewQuestionNotification(guests) {
    for (let i = 0; i < guests.length; i += 1) {
        const guest = {
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
    // Send an email to each guest
    try {
        const guests = await sequelize.query(
            `SELECT
                user_id,
                email
            FROM
                users
            WHERE
                fk_status = 'active'`,
            {
                type: QueryTypes.SELECT,
            },
        );
        await sendUsersInvitationToActivateNewQuestionNotification(guests);
    } catch (err) {
        res.status(500).send({
            user_message: 'Impossible d\'envoyer les invitations',
        });
        return next(err);
    }

    return res.status(200).send({});
};
