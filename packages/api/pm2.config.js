module.exports = {
    apps: [
        {
            name: 'api',
            script: 'server/index.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
