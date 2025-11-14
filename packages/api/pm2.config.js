module.exports = {
    apps: [
        {
            name: 'api',
            script: 'server/index.js',
            exec_mode: 'cluster',
            instances: process.env.RB_API_CPU_INSTANCES || 1,
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
