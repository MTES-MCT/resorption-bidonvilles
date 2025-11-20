import multer from 'multer';
import bodyParser from 'body-parser';
import { authenticate } from '#server/middlewares/authMiddleware';
import validation from '#server/middlewares/validationMiddleware';
import checkCharterMiddleware from '#server/middlewares/charteMiddleware';
import checkAppVersionMiddleware from '#server/middlewares/appVersionMiddleware';
import fileValidator from '#server/middlewares/fileValidator';

import { type Application } from 'express';
import { type ValidationChain } from 'express-validator';

type RouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type RouteOptions = {
    multipart?: boolean,
    authenticate?: boolean,
    checkCharter?: boolean,
    checkAppVersion?: boolean,
};
type CustomRouteMethod = (
    route: string,
    controller: Function,
    validator?: ValidationChain[],
    options?: RouteOptions
) => void;
type CustomRouteMethodsList = {
    get: CustomRouteMethod,
    post: CustomRouteMethod,
    put: CustomRouteMethod,
    patch: CustomRouteMethod,
    delete: CustomRouteMethod,
};

export type ApplicationWithCustomRoutes = Application & {
    customRoutes: CustomRouteMethodsList,
};

const upload = multer({
    storage: multer.memoryStorage(),
});

function addRoute(
    app: Application,
    method: RouteMethod,
    route: string,
    controller: Function,
    validator?: ValidationChain[],
    options: RouteOptions = {
        multipart: false,
        authenticate: true,
        checkCharter: false,
        checkAppVersion: false,
    },
): void {
    const middlewares = [];

    // on authentifie l'utilisateur
    if (options.authenticate !== false) {
        middlewares.push(authenticate);
    }

    // on parse les données
    if (options.multipart === true) {
        middlewares.push(
            upload.array('attachments'),
            fileValidator,
            (req, res, next) => {
                try {
                    req.body = JSON.parse(req.body.content);
                    next();
                } catch (error) {
                    console.error('[MULTIPART ERROR]', error.message, req.body);
                    res.status(400).send({ error: 'Champ multipart invalide' });
                }
            },
        );
    } else {
        middlewares.push(bodyParser.json());
    }

    // on vérifie que l'utilisateur a signé la dernière charte publiée
    if (options.checkCharter === true) {
        middlewares.push(checkCharterMiddleware);
    }

    // on initialise le last_changelog de l'utilisateur, si nécessaire
    if (options.checkAppVersion === true) {
        middlewares.push(checkAppVersionMiddleware);
    }

    // on valide les données
    if (validator !== undefined && validator.length > 0) {
        middlewares.push(validator, validation);
    }

    // on appelle le contrôleur
    middlewares.push(controller);

    // on définit la route
    app[method](route, ...middlewares);
}

// L'objet de ce loader est d'ajouter à app des méthodes personnalisées
// pour définir des routes GET, POST, PUT, PATCH, et DELETE.
// Ces méthodes personnalisées mutualisent des comportements génériques à toute notre API
// comme l'authentification, les validators, le parsing json et multipart, etc.
// ce qui évite d'avoir à réimplémenter ces comportements sur chaque route.
// Pour plus d'information, consulter la fonction `addRoute()` définie ci-dessus.
export default (app: Application): ApplicationWithCustomRoutes => {
    const customRoutes: CustomRouteMethodsList = {
        get(route, controller, validator, options) {
            return addRoute(app, 'get', route, controller, validator, options);
        },
        post(route, controller, validator, options) {
            return addRoute(app, 'post', route, controller, validator, options);
        },
        put(route, controller, validator, options) {
            return addRoute(app, 'put', route, controller, validator, options);
        },
        patch(route, controller, validator, options) {
            return addRoute(app, 'patch', route, controller, validator, options);
        },
        delete(route, controller, validator, options) {
            return addRoute(app, 'delete', route, controller, validator, options);
        },
    };

    Object.assign(app, { customRoutes });
    return app as ApplicationWithCustomRoutes;
};
