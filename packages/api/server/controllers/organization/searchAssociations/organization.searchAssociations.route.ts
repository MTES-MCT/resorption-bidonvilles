import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.searchAssociations.validator';
import controller from './organization.searchAssociations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/associations/search', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
