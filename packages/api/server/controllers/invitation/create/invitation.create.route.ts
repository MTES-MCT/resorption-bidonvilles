import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './invitation.create.validator';
import controller from './invitation.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/invitations', controller, validator, {
        authenticate: false,
        multipart: false,
    });
};
