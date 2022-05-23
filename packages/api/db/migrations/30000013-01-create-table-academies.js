/* eslint-disable object-curly-newline */
const academies = [
    { uid: 'clermont', particle: 'de ', name: 'Clermont-Ferrand', departements: ['03', '15', '43', '63'] },
    { uid: 'grenoble', particle: 'de ', name: 'Grenoble', departements: ['07', '26', '38', '73', '74'] },
    { uid: 'lyon', particle: 'de ', name: 'Lyon', departements: ['01', '42', '69'] },
    { uid: 'besancon', particle: 'de ', name: 'Besançon', departements: ['25', '39', '70', '90'] },
    { uid: 'dijon', particle: 'de ', name: 'Dijon', departements: ['21', '58', '71', '89'] },
    { uid: 'rennes', particle: 'de ', name: 'Rennes', departements: ['22', '29', '35', '56'] },
    { uid: 'orleans', particle: 'd\'', name: 'Orléans-Tours', departements: ['18', '28', '36', '37', '41', '45'] },
    { uid: 'corse', particle: 'de ', name: 'Corse', departements: ['2A', '2B'] },
    { uid: 'nancy', particle: 'de ', name: 'Nancy-Metz', departements: ['54', '55', '57', '88'] },
    { uid: 'reims', particle: 'de ', name: 'Reims', departements: ['08', '10', '51', '52'] },
    { uid: 'strasbourg', particle: 'de ', name: 'Strasbourg', departements: ['67', '68'] },
    { uid: 'guadeloupe', particle: 'de ', name: 'la Guadeloupe', departements: ['971'] },
    { uid: 'guyane', particle: 'de ', name: 'la Guyane', departements: ['973'] },
    { uid: 'amiens', particle: 'd\'', name: 'Amiens', departements: ['02', '60', '80'] },
    { uid: 'lille', particle: 'de ', name: 'Lille', departements: ['59', '62'] },
    { uid: 'creteil', particle: 'de ', name: 'Créteil', departements: ['77', '93', '94'] },
    { uid: 'paris', particle: 'de ', name: 'Paris', departements: ['75'] },
    { uid: 'versailles', particle: 'de ', name: 'Versailles', departements: ['78', '91', '92', '95'] },
    { uid: 'martinique', particle: 'de ', name: 'Martinique', departements: ['972'] },
    { uid: 'normandie', particle: 'de ', name: 'Normandie', departements: ['14', '50', '61', '27', '76'] },
    { uid: 'bordeaux', particle: 'de ', name: 'Bordeaux', departements: ['24', '33', '40', '47', '64'] },
    { uid: 'limoges', particle: 'de ', name: 'Limoges', departements: ['19', '23', '87'] },
    { uid: 'poitiers', particle: 'de ', name: 'Poitiers', departements: ['16', '17', '79', '86'] },
    { uid: 'montpellier', particle: 'de ', name: 'Montpellier', departements: ['11', '30', '34', '48', '66'] },
    { uid: 'toulouse', particle: 'de ', name: 'Toulouse', departements: ['09', '12', '31', '32', '46', '65', '81', '82'] },
    { uid: 'nantes', particle: 'de ', name: 'Nantes', departements: ['44', '49', '53', '72', '85'] },
    { uid: 'aix', particle: 'd\'', name: 'Aix-Marseille', departements: ['04', '05', '13', '84'] },
    { uid: 'nice', particle: 'de ', name: 'Nice', departements: ['06', '83'] },
    { uid: 'reunion', particle: 'de ', name: 'La Réunion', departements: ['974'] },
    { uid: 'mayotte', particle: 'de ', name: 'Mayotte', departements: ['976'] },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.createTable(
                'academies',
                {
                    uid: {
                        type: Sequelize.STRING,
                        primaryKey: true,
                    },
                    particle: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                { transaction },
            ),
            queryInterface.addColumn(
                'departements',
                'fk_academie',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                { transaction },
            ),
        ]);

        // add constraints
        await Promise.all([
            queryInterface.addConstraint(
                'academies',
                ['name'],
                {
                    type: 'unique',
                    name: 'uk_academies_name',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'departements',
                ['fk_academie'],
                {
                    type: 'foreign key',
                    name: 'fk_departements_academie',
                    references: {
                        table: 'academies',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
        ]);

        // populate
        await queryInterface.bulkInsert(
            'academies',
            academies.map(({ uid, particle, name }) => ({
                uid,
                particle,
                name,
            })),
            { transaction },
        );
        await Promise.all(
            academies.map(({ uid, departements }) => departements.map(departement => queryInterface.sequelize.query(
                'UPDATE departements SET fk_academie = :academie WHERE code = :departement',
                {
                    replacements: {
                        academie: uid,
                        departement,
                    },
                    transaction,
                },
            ))).flat(),
        );

        // change constraint (fk_academie NOT NULLABLE)
        await queryInterface.changeColumn(
            'departements',
            'fk_academie',
            {
                type: Sequelize.STRING,
                allowNull: false,
            },
            { transaction },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint('academies', 'uk_academies_name', { transaction }),
            queryInterface.removeConstraint('departements', 'fk_departements_academie', { transaction }),
        ]);

        await Promise.all([
            queryInterface.removeColumn('departements', 'fk_academie', { transaction }),
            queryInterface.dropTable('academies', { transaction }),
        ]);

        return transaction.commit();
    },
};
