import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.updateActor.validator';
import controller from './shantytown.updateActor';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/towns/:id/actors/:userId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
