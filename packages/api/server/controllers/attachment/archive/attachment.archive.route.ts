import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './attachment.archive.validator';
import controller from './attachment.archive';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/attachments/:id', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
