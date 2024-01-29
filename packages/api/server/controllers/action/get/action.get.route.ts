import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/:id', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
