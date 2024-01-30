import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './config.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/config', controller, undefined, {
        authenticate: true,
        multipart: false,
        checkAppVersion: true,
    });
};
