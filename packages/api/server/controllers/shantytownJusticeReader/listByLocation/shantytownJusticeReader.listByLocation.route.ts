import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytownJusticeReader.listByLocation.validator';
import controller from './shantytownJusticeReader.listByLocation';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.get('/justice-readers/:locationType/:locationCode', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
