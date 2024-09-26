import shantytownDecreesService from '#server/services/shantytownDecree';
import { ShantytownDecree } from '#server/models/shantytownDecreeModel/shantytownDecrees.d';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};
/**
1. On vérifie si l'utilisateur est admin national
2. S'il ne l'est pas, on vérifie s'il est dans la liste findJusticeReadersByUserId
3. Si 1 ou 2 valide, on récupère la liste des arrêtés via la table shantytown_decrees
4. On retourne la liste des arrêtés
 */
export default async (req, res, next) => {
    let shantytownDecrees: ShantytownDecree[] = [];
    try {
        shantytownDecrees = await shantytownDecreesService.findAll(req.user, req.params.id);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send(shantytownDecrees);
};
