import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.update.validator';
import controller from './shantytown.update';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.patch('/towns/:id', controller, validator, {
        authenticate: true,
        multipart: true,
    });
};
