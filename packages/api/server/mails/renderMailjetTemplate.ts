import { Liquid } from 'liquidjs';

const engine = new Liquid({
    cache: false,
    strictVariables: false,
});

const normalizeMailjetSyntax = (template: string): string => template
    .replaceAll(/\bvar:([A-Za-z0-9_.]+)/g, 'var.$1')
    .replaceAll(/{%\s*elseif\b/g, '{% elsif');

const renderMailjetTemplate = (template: string, variables: { [key: string]: any }): Promise<string> => engine.parseAndRender(normalizeMailjetSyntax(template), {
    var: variables,
    ...variables,
});
export default renderMailjetTemplate;
