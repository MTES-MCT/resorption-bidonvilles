import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
