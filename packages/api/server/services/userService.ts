import createUser from './createUser';

const userService = {
    async create(data, createdBy = null) {
        // insert user into database
        try {
            return await createUser(Object.assign({}, data, {
                created_by: createdBy,
            }));
        } catch (error) {
            return {
                error: {
                    code: 500,
                    response: {
                        error: {
                            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                            developer_message: 'Failed inserting the new user into database',
                        },
                    },
                },
            };
        }
    },
};

export default userService;
