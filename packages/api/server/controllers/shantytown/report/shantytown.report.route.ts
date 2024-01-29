import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.report.validator';
import controller from './shantytown.report';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.post('/town-report', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
