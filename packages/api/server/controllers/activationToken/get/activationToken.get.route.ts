import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './activationToken.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/activation-tokens/:token', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
