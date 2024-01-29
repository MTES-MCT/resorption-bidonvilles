import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.createAnswer.validator';
import controller from './question.createAnswer';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/questions/:id/answers', controller, validator, {
        authenticate: true,
        multipart: true,
    });
};
