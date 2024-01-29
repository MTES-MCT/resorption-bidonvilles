import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.delete.validator';
import controller from './question.delete';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/questions/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
