import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organization.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organizations/organizations/search', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
