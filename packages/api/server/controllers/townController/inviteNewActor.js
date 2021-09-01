
const { triggerActorInvitedAlert } = require('#server/utils/mattermost');
const {
    sendUserShantytownActorInvitation,
} = require('#server/mails/mails');
const { formatName } = require('#server/models/userModel')();

module.exports = () => async (req, res, next) => {
    try {
        await sendUserShantytownActorInvitation({ email: req.body.email }, {
            variables: {
                inviterName: formatName(req.user),
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
        // ignore
    }

    return res.status(204).send({});
};
