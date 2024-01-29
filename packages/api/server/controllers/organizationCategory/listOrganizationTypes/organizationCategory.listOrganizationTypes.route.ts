import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organizationCategory.listOrganizationTypes';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organization-categories/:categoryId/organization-types', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
