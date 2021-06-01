module.exports = {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'rb_database_data',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    define: {
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: false,
    },
};
