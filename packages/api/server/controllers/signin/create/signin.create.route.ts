import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './signin.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/signin', controller, undefined, {
        authenticate: false,
        multipart: false,
    });
};
