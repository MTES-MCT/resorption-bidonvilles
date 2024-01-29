import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './userWithPrivilege.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users-with-privilege', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
