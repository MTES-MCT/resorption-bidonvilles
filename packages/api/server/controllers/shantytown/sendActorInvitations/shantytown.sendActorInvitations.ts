
import mattermostUtils from '#server/utils/mattermost';
import mailsUtils from '#server/mails/mails';
import userModel from '#server/models/userModel';

const { triggerActorInvitedAlert } = mattermostUtils;
const { sendUserShantytownActorInvitation } = mailsUtils;

export default async (req, res, next) => {
    try {
        await sendUserShantytownActorInvitation({ email: req.body.email }, {
            variables: {
                inviterName: userModel.formatName(req.user),
                shantytown: req.shantytown,
            },
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'envoi du courriel',
        });
        return next(error);
    }

    try {
        await triggerActorInvitedAlert(req.shantytown, req.user, req.body.email);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return res.status(204).send({});
};
