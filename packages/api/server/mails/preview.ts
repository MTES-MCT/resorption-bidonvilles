import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import nunjucks from 'nunjucks';

const args = process.argv.slice(2);

const getArg = (names: string[]): string | undefined => {
    const index = args.findIndex(arg => names.includes(arg));
    if (index === -1) {
        return undefined;
    }

    return args[index + 1];
};

const templateName = getArg(['--template', '-t']);
const variablesPath = getArg(['--variables', '-v']);
const outputPathArg = getArg(['--output', '-o']);
const strictMode = args.includes('--strict');

if (!templateName || !variablesPath) {
    console.error('Usage: yarn emails:preview --template <name> --variables <path/to/variables.json> [--output <path/to/output.html>]');
    process.exit(1);
}

const normalizeMailjetSyntax = (template: string): string => template
    .replace(/\bvar:([A-Za-z0-9_.]+)/g, 'var.$1')
    .replace(/{%\s*elseif\b/g, '{% elif');

const run = (): void => {
    const templatePath = path.resolve(__dirname, 'src', `${templateName}.mjml`);

    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template introuvable: ${templatePath}`);
    }

    const absoluteVariablesPath = path.resolve(process.cwd(), variablesPath);
    if (!fs.existsSync(absoluteVariablesPath)) {
        throw new Error(`Fichier de variables introuvable: ${absoluteVariablesPath}`);
    }

    const variables = JSON.parse(fs.readFileSync(absoluteVariablesPath, 'utf-8'));
    const mjmlContent = fs.readFileSync(templatePath, 'utf-8');
    const compiled = mjml2html(mjmlContent, { filePath: templatePath });

    if (compiled.errors.length > 0) {
        compiled.errors.forEach((error) => {
            console.warn(`[MJML] ${error.formattedMessage}`);
        });
        if (strictMode) {
            process.exit(1);
        }
    }

    const environment = nunjucks.configure({ autoescape: false });
    const html = environment.renderString(normalizeMailjetSyntax(compiled.html), {
        var: variables,
        ...variables,
    });

    const outputDir = path.resolve(__dirname, 'preview');
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = outputPathArg
        ? path.resolve(process.cwd(), outputPathArg)
        : path.join(outputDir, `${templateName}.preview.html`);

    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`Preview générée: ${outputPath}`);
};

run();
