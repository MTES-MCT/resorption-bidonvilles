import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './location.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/locations/:type/:code?', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
