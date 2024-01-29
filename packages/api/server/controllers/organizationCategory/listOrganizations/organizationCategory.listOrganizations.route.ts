import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organizationCategory.listOrganizations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organization-categories/:categoryId/organizations', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
