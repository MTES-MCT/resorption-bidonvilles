module.exports = {
    apps: [
        {
            name: 'api',
            script: 'dist/api/server/index.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
