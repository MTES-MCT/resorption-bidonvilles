import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './location.search';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/locations/search', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
