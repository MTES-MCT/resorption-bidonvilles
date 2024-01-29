import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './statistics.getTownReport.validator';
import controller from './statistics.getTownReport';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/statistics/town-report', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
