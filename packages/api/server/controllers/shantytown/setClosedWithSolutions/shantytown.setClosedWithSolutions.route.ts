import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.setClosedWithSolutions.validator';
import controller from './shantytown.setClosedWithSolutions';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/towns/:id/closed-with-solutions', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
