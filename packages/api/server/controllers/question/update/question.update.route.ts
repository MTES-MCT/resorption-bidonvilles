import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.update.validator';
import controller from './question.update';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.patch('/questions/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
