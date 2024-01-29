import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytown.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/towns', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
