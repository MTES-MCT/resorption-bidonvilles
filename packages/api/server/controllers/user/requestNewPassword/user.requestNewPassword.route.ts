import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.requestNewPassword.validator';
import controller from './user.requestNewPassword';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/new-password-request', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
