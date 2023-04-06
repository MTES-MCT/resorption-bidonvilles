import mailsUtils from '#server/mails/mails';
import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

const { sendUserInvitationToActivateNewQuestionNotification } = mailsUtils;

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
        await Promise.all(
            guests.map(
                guest => sendUserInvitationToActivateNewQuestionNotification(guest),
            ),
        );
    } catch (err) {
        res.status(500).send({
            user_message: 'Impossible d\'envoyer les invitations',
        });
        return next(err);
    }

    return res.status(200).send({});
};
