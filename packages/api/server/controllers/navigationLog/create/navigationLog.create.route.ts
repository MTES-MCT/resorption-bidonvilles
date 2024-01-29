import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './navigationLog.create.validator';
import controller from './navigationLog.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/navigation-logs', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
