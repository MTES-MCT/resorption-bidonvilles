import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.removeActorTheme.validator';
import controller from './shantytown.removeActorTheme';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.delete('/towns/:id/actors/:userId/themes/:themeId', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
