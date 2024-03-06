import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './organization.searchPrivateOrganizations.validator';
import controller from './organization.searchPrivateOrganizations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/private-organizations/search', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
