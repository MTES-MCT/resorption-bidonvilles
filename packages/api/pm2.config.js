module.exports = {
    apps: [
        {
            name: 'api',
            script: 'server/index.js',
            exec_mode: 'cluster',
            instances: 'max',
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
