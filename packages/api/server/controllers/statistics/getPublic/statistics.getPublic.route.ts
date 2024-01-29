import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './statistics.getPublic';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/statistics', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
