import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './activity.list.validator';
import controller from './activity.list';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/activities', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
