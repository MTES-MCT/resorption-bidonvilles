import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.deleteActor.validator';
import controller from './shantytown.deleteActor';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/towns/:id/actors/:userId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
