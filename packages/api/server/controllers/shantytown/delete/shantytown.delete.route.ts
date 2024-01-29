import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './shantytown.delete';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/towns/:id', controller, undefined, {
        authenticate: true,
        multipart: false,
    });
};
