import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './passwordToken.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/password-tokens/:token', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
