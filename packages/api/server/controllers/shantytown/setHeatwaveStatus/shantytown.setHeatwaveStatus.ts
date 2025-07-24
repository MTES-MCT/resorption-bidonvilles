import shantytownService from '#server/services/shantytown';
import mattermostUtils from '#server/utils/mattermost';

const { triggerHeatwaveStatusChange } = mattermostUtils;

const ERROR_RESPONSES = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const updatedTown = await shantytownService.setHeatwaveStatus(req.user, req.body);

        await triggerHeatwaveStatusChange(req.user, updatedTown, req.body.heatwave_status);

        return res.status(200).send(updatedTown);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
};
