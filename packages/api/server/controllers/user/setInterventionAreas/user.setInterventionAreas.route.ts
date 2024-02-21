import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.setInterventionAreas.validator';
import controller from './user.setInterventionAreas';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/intervention-areas', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
