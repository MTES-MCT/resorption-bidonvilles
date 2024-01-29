import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.setHeatwaveStatus.validator';
import controller from './shantytown.setHeatwaveStatus';

export default (app: ApplicationWithCustomRoutes): void => {
    app.customRoutes.put('/towns/:id/heatwave-status', controller, validator, {
        authenticate: true,
        multipart: false,
    });
};
