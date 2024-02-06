import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './organizationType.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/organization-types', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
