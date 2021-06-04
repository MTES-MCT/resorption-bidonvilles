
const { triggerActorInvitedAlert } = require('#server/utils/slack');
const {
    sendUserShantytownActorInvitation,
} = require('#server/mails/mails');


module.exports = () => async (req, res, next) => {
    try {
        await sendUserShantytownActorInvitation({ email: req.body.email }, {
            variables: {
                inviterName: `${req.user.first_name} ${req.user.last_name}`,
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
