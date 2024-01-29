import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.getActivationLink.validator';
import controller from './user.getActivationLink';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/users/:id/activation-links', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
