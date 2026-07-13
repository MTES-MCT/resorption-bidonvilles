import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytownComment.updateComment.validator';
import controller from './shantytownComment.updateComment';

export default function updateCommentRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.patch('/towns/:id/comments/:commentId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
}
