import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.updateComment.validator';
import controller from './shantytown.updateComment';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.patch('/towns/:id/comments/:commentId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
