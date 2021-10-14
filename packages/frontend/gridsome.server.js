const pages = require("./routes");
const fs = require("fs");

module.exports = function(api) {
    api.createPages(({ createPage }) => {
        for (const page of pages) {
            createPage(page);
        }
    });
    api.afterBuild(({ redirects }) => {
        const redirectsStream = fs.createWriteStream("./docker/redirects.conf");
        for (const rule of redirects) {
            const from = rule.from
                .replace(/:([^/]*)/, "([^/]*)")
                .replace(/\/:(.*)?$/, "(\\/(.*))?");
            const to = rule.to;

            redirectsStream.write(`
location ~ ^${from} {
    rewrite ${from} ${to} break;
}
`);
        }
        redirectsStream.end();
    });
};
