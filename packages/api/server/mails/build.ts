import fs from 'fs';
import mjml2html from 'mjml';
import path from 'path';
import rimraf from 'rimraf';
import { JSDOM } from 'jsdom';
import { htmlToText } from 'html-to-text';

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
            const text = htmlToText(html, { tags: { img: { format: 'skip' } } });
            const { document } = new JSDOM(html).window;
            const subject = document.querySelector('title').textContent.trim();

            fs.writeFileSync(path.resolve(output, `${name}.html`), html);
            fs.writeFileSync(path.resolve(output, `${name}.text`), text);
            fs.writeFileSync(path.resolve(output, `${name}.subject.text`), subject);
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
