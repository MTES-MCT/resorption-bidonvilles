const pages = require('./routes')

module.exports = function(api) {
    api.createPages(({ createPage }) => {
        for (const page of pages) {
            createPage(page);
        }
    });
};
