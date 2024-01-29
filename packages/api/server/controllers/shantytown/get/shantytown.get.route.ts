import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytown.get';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns/:id', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
