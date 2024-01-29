import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.sendActivationLink.validator';
import controller from './user.sendActivationLink';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/users/:id/activation-links', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
