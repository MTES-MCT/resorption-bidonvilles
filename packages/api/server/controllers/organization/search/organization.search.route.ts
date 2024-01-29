import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.search.validator';
import controller from './organization.search';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/search', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
