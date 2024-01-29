import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.create.validator';
import controller from './question.create';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/questions', controller, validator, {
        authenticate: true,
        multipart: true,
    });
};
