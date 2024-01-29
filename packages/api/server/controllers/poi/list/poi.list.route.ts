import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './poi.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/pois', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
