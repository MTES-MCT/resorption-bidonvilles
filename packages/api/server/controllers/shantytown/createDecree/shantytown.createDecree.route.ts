import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import validator from './shantytown.createDecree.validator';
import controller from './shantytown.createDecree';

export default (app: ApplicationWithCustomRoutes): void => {
    console.log('Route chargée: POST /towns/:id/decrees');

    app.customRoutes.post('/towns/:id/decrees', controller, validator, {
        authenticate: true,
        // multipart: true,
        multipart: false,
    });
};
