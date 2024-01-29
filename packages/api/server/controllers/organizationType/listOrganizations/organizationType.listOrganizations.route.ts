import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organizationType.listOrganizations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organization-types/:typeId/organizations', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
