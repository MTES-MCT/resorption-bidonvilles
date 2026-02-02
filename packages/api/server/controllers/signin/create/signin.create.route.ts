import bodyParser from 'body-parser';
import { type ApplicationWithCustomRoutes } from '#server/loaders/customRouteMethodsLoader';
import signinRateLimiter from '#server/middlewares/signinRateLimiter';
import controller from './signin.create';

export const signinCreateRoute = (app: ApplicationWithCustomRoutes): void => {
    app.post('/signin', bodyParser.json(), signinRateLimiter, controller);
};

export default signinCreateRoute;
