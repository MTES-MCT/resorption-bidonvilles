import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.createComment.validator';
import controller from './shantytown.createComment';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/towns/:id/comments', controller, validator, {
        authenticate: true,
        multipart: true,
    });
};
