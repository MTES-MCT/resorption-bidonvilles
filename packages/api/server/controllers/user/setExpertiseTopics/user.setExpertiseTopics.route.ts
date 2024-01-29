import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './user.setExpertiseTopics.validator';
import controller from './user.setExpertiseTopics';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/users/:id/expertise-topics', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
