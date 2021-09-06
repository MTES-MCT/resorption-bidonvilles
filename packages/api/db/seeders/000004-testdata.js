const crypto = require('crypto');

const geographic_levels = ['nation', 'region', 'departement', 'epci', 'city'];
const location_codes = {
    region: '44',
    departement: '08',
    epci: '240800862',
    city: '08165',
};

async function reset(queryInterface, transaction) {
    await queryInterface.sequelize.query(
        `   DELETE
              FROM users
             WHERE first_name = '[TestData]'`,
        {
            transaction,
        },
    );
    await queryInterface.sequelize.query(
        `DELETE
           FROM organizations
          WHERE name LIKE '[TestData] %'`,
        {
            transaction,
        },
    );
}

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        async (transaction) => {
            const [regularRoles, [{ lastCharteEngagement }]] = await Promise.all([
                queryInterface.sequelize.query(
                    `SELECT *
                       FROM (
                            SELECT rr.role_id,
                                   ot.organization_type_id,
                                   RANK() OVER(PARTITION BY ot.fk_role ORDER BY ot.organization_type_id ASC) AS "rank"
                              FROM roles_regular rr
                         LEFT JOIN organization_types ot ON ot.fk_role = rr.role_id
                        ) t
                      WHERE t.rank = 1`,
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                    },
                ),
                queryInterface.sequelize.query(
                    `SELECT MAX(version) AS "lastCharteEngagement"
                       FROM chartes_engagement`,
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                    },
                ),
            ]);

            await reset(queryInterface, transaction);

            const orgs = geographic_levels.reduce((acc, geographicLevel) => [
                ...acc,
                ...regularRoles.map((role) => {
                    const row = {
                        name: `[TestData] ${geographicLevel}-${role.role_id}`,
                        abbreviation: null,
                        active: true,
                        fk_type: role.organization_type_id,
                        fk_region: null,
                        fk_departement: null,
                        fk_epci: null,
                        fk_city: null,
                    };

                    if (location_codes[geographicLevel]) {
                        row[`fk_${geographicLevel}`] = location_codes[geographicLevel];
                    }

                    return Object.values(row);
                }),
            ], []);

            await queryInterface.sequelize.query(
                `INSERT INTO organizations
                            (name, abbreviation, active, fk_type, fk_region, fk_departement, fk_epci, fk_city)
                      VALUES ${Array(orgs.length).fill('(?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`,
                {
                    replacements: orgs.flat(1),
                    transaction,
                },
            );

            const organizations = await queryInterface.sequelize.query(
                `SELECT organization_id,
                        name
                   FROM organizations
                  WHERE name LIKE '[TestData] %'`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            const salt = crypto.randomBytes(16).toString('hex');
            const password = crypto.pbkdf2Sync('motdepasse', salt, 10000, 512, 'sha512').toString('hex');
            const users = organizations.reduce((acc, { organization_id: organizationId, name }) => {
                const [geographicLevel, roleId] = name.slice(11).split('-');

                const row = {
                    email: `testdata+${geographicLevel}__${roleId}__%localadmin%@resorption-bidonvilles.beta.gouv.fr`,
                    password,
                    salt,
                    first_name: '[TestData]',
                    last_name: '[TestData]',
                    fk_role: null,
                    fk_status: 'active',
                    access_request_message: 'Je suis un faux utilisateur, servant aux tests automatisés.',
                    created_by: 1,
                    phone: '0601020304',
                    position: 'Test',
                    fk_organization: organizationId,
                    last_version: '20.0.0',
                    last_changelog: '20.0.0',
                    charte_engagement_signee: lastCharteEngagement,
                };

                return [
                    ...acc,
                    Object.values({ ...row, email: row.email.replace('%localadmin%', 'notadmin') }),
                    Object.values({ ...row, email: row.email.replace('%localadmin%', 'localadmin'), fk_role: 'local_admin' }),
                    Object.values({ ...row, email: row.email.replace('%localadmin%', 'nationaladmin'), fk_role: 'national_admin' }),
                ];
            }, []);

            await queryInterface.sequelize.query(
                `INSERT INTO users
                            (email, password, salt, first_name, last_name, fk_role, fk_status, access_request_message, created_by, phone, position, fk_organization, last_version, last_changelog, charte_engagement_signee)
                      VALUES ${Array(users.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`,
                {
                    replacements: users.flat(1),
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                {
                    transaction,
                },
            );
        },
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        async transaction => reset(queryInterface, transaction),
    ),
};
