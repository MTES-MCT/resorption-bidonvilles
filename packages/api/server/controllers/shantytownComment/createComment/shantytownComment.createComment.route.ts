import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytownComment.createComment.validator';
import controller from './shantytownComment.createComment';

export default function createCommentRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.post('/towns/:id/comments', controller, validator, {
        authenticate: true,
        multipart: true,
    });
}
