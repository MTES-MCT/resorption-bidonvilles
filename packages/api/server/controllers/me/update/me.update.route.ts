import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './me.update.validator';
import controller from './me.update';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.patch('/me', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
