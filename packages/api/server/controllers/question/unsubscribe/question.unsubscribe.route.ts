import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.unsubscribe.validator';
import controller from './question.unsubscribe';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/questions/:id/unsubscription', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
