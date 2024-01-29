import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './question.subscribe.validator';
import controller from './question.subscribe';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/questions/:id/subscription', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
