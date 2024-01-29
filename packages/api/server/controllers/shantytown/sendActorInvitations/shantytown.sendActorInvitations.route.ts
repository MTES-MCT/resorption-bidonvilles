import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.sendActorInvitations.validator';
import controller from './shantytown.sendActorInvitations';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/actor-invitations', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
