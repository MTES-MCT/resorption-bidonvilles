import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.getHistory';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions/:id/history', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
