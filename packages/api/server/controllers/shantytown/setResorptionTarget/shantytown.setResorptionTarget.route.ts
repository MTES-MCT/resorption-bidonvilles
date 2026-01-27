import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.setResorptionTarget.validator';
import controller from './shantytown.setResorptionTarget';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/towns/:id/resorption-target', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
