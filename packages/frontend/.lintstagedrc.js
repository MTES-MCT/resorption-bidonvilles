module.exports = {
    "{src,cypress,public}/**/*.{js,jsx,vue}": (filenames) => {
        return filenames.map(name => {
            const [, path] = name.split('packages/frontend/');
            return `yarn lint ${path}`;
        });
    },
};