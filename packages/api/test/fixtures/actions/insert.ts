import sequelizeFactory from '#test/db/sequelize';

export default (rows: any[]): Promise<any> => sequelizeFactory()
    .getQueryInterface()
    .bulkInsert(
        'actions',
        rows.map(row => ({
            name: 'Une action',
            ...row,
        })),
    );
