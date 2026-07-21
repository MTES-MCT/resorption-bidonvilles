import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './actionComment.updateComment.validator';
import controller from './actionComment.updateComment';

export default function updateCommentRoute(app: ApplicationWithCustomRoutes): void {
    app.customRoutes.patch('/actions/:id/comments/:commentId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
}
