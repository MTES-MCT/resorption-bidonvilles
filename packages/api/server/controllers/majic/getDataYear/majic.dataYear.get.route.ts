import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './majic.dataYear.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/majic-data-year', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
