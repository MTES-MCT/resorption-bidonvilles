import sequelizeFactory from '#test/db/sequelize';
import authUtils from '#server/utils/auth';

type UserRow = {
    user_id?: number,
    email?: string,
    password?: string,
    salt?: string,
    created_at?: Date,
    updated_at?: Date,
    first_name?: string,
    last_name?: string,
    fk_role?: string,
    fk_role_regular?: string,
    fk_status?: string,
    access_request_message?: string,
    created_by?: number,
    phone?: string,
    position?: string,
    fk_organization?: number,
    last_version?: string,
    last_changelog?: string,
    charte_engagement_signee?: number,
    last_access?: Date,
    admin_comments?: string,
    to_be_tracked?: boolean,
};

export default (rows: UserRow[]): Promise<any> => sequelizeFactory()
    .getQueryInterface()
    .bulkInsert(
        'users',
        rows.map(row => ({
            email: 'test@test.fr',
            password: authUtils.hashPassword('password', 'sel'),
            salt: 'sel',
            first_name: 'Compte',
            last_name: 'De test',
            fk_role: null,
            fk_role_regular: 'direct_collaborator',
            fk_status: 'active',
            access_request_message: null,
            created_by: 1,
            phone: '118218',
            position: 'Test',
            fk_organization: 40760, // DIHAL
            last_version: '20.0.0',
            last_changelog: '20.0.0',
            charte_engagement_signee: 2,
            last_access: new Date(),
            admin_comments: null,
            to_be_tracked: false,
            ...row,
        })),
    );
