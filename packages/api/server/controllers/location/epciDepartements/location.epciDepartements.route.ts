import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './location.epciDepartements';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/locations/epci/:code/departements', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
