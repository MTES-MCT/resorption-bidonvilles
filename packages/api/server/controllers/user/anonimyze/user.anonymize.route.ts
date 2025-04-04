import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.anonymize.validator';
import controller from './user.anonymize';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/anonymize', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
