import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './user.checkPassword';
import validator from './user.checkPassword.validator';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/checkPassword', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
