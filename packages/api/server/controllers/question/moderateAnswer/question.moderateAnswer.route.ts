import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.moderateAnswer.validator';
import controller from './question.moderateAnswer';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/questions/:id/answers/:answerId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
