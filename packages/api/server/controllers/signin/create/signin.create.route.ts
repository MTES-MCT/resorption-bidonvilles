import bodyParser from 'body-parser';
import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import controller from './signin.create';

export const signinCreateRoute = (app: ApplicationWithCustomRoutes): void => {
    app.post('/signin', bodyParser.json(), controller);
};

export default signinCreateRoute;
