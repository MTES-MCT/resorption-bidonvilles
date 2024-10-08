import rewiremock, { addPlugin, overrideEntryPoint } from 'rewiremock/node';
import { plugins } from 'rewiremock';

overrideEntryPoint(module);
rewiremock.passBy(name => name.slice(-2) === '.d' || /\/ServiceError\.?|\/moment\.?|server\/config\.ts/.test(name) || /fromMimeToExtension/.test(name));
rewiremock.isolation({
    noAutoPassBy: true,
});
addPlugin(plugins.nodejs);
addPlugin(plugins.relative);
addPlugin(plugins.toBeUsed);
addPlugin(plugins.usedByDefault);

export { rewiremock };
export default rewiremock;
