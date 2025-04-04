const crypto = require('crypto');

function generate(email, password, first_name, last_name, fk_role, fk_role_regular, phone, position) {
    const salt = crypto.randomBytes(16).toString('hex');

    return {
        email,
        password: crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex'),
        salt,
        first_name,
        last_name,
        fk_role,
        fk_role_regular,
        fk_status: 'active',
        access_request_message: 'Compte généré automatiquement',
        phone,
        position,
        fk_organization: 40760, // DIHAL
        charte_engagement_signee: 2,
    };
}

module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'users',
        [
            generate(
                'admin@resorption-bidonvilles.beta.gouv.fr',
                'fabnum',
                'Administrateur',
                'Résorption Bidonvilles',
                'national_admin',
                'direct_collaborator',
                '00 00 00 00 00',
                'Administrateur',
            ),
        ],
    ),

    down:
        (queryInterface, Sequelize) => queryInterface.bulkDelete(
            'users',
            {
                email: {
                    [Sequelize.Op.like]: 'admin@resorption-bidonvilles.beta.gouv.fr',
                },
            },
        ),
};
