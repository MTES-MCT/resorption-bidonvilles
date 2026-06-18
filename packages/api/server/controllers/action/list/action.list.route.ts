import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './action.list';
import validator from './action.list.validator';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/actions', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
