const fs = require('fs');
const mjml2html = require('mjml')
const path = require('path')
const rimraf = require('rimraf')

// __dirname when the script is executed is /dist
const dirname = path.join(__dirname, './src');
const output = path.join(__dirname, './dist');

// Parse all src/file.mjml file and convert them in HTML
const convertFiles = () => {
    const filenames = fs.readdirSync(dirname);
    filenames.forEach((filename) => {
        const filePath = path.resolve(dirname, filename);
        const { ext, name } = path.parse(filePath);
        if (ext === '.mjml') {
            const content = fs.readFileSync(filePath, 'utf-8');
            const { html } = mjml2html(content, {
                filePath: path.resolve(dirname, filename),
            });
            fs.writeFileSync(path.resolve(output, `${name}.html`), html);
        }
    });
};

const run = () => {
    rimraf(output, () => {
        fs.mkdirSync(output);
        convertFiles();
        process.exit(0);
    });
};
run();
