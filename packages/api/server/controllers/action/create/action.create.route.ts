import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './action.create.validator';
import controller from './action.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/actions', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
