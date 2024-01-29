import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './action.createComment.validator';
import controller from './action.createComment';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/actions/:id/comments', controller, validator, {
        authenticate: true,
        multipart: true,
    });
};
