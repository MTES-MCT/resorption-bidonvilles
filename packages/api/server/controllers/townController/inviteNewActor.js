
const mailService = require('#server/services/mailService');
const { triggerActorInvitedAlert } = require('#server/utils/slack');

module.exports = () => async (req, res, next) => {
    try {
        await mailService.send(
            'shantytown_actors/invitation',
            {
                email: req.body.email,
            },
            null,
            [
                req.user,
                req.shantytown,
            ],
            mailService.PRESERVE_RECIPIENT,
        );
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'envoi du courriel',
        });
        return next(error);
    }

    try {
        await triggerActorInvitedAlert(req.shantytown, req.user, req.body.email);
    } catch (error) {
        console.log(error);
    }

    return res.status(204).send({});
};
