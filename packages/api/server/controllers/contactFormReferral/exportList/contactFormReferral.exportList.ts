import JSONToCSV from 'json2csv';
import contactFormReferralService from '#server/services/contactFormReferral';

export default async (req, res, next) => {
    let referrals;

    try {
        referrals = await contactFormReferralService.exportAll(req.user);
    } catch (error) {
        let errorMessage = 'Une erreur inconnue est survenue';
        if (error.code === 'fetch_failed') {
            errorMessage = 'Une erreur est survenue lors de la lecture en base de données';
        }

        res.status(500).send({
            user_message: errorMessage,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(200).send({
        csv: JSONToCSV.parse(referrals),
    });
};
