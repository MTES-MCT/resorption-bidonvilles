/**
 * Fonction Factory utilisées par les migrations qui rafraîchissent des vues SQL
 * @param {Array<{name: string, oldView: string, newView: string}>} views - tableau de définition de vues SQL
 * Chaque objet view contoient:
 *   - name: nom de la vue
 *   - oldView: requête SQL pour créer la vue pré-existante (utilisée en cas de rollback)
 *   - newView: requête SQL pour créer la nouvelle version de la vue
 * Les vues sont supprimées dans l'ordre et recréées en ordre inverse
 * @returns {object} Un objet migration avec ses méthodes up et down
 */
module.exports = function refreshViewCascade(views) {
    return {
        async up(queryInterface) {
            const transaction = await queryInterface.sequelize.transaction();

            try {
                // Supprime les vues dans l'ordre (d'abord les dépendances)
                await views.reduce(
                    (promise, view) => promise.then(() => queryInterface.sequelize.query(
                        `DROP VIEW ${view.name}`,
                        { transaction },
                    )),
                    Promise.resolve(),
                );

                // Recrée les vues en ordre inverse (les vues "bases" d'avord)
                await views.toReversed().reduce(
                    (promise, view) => promise.then(() => queryInterface.sequelize.query(view.newView, { transaction })),
                    Promise.resolve(),
                );

                return transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },

        async down(queryInterface) {
            const transaction = await queryInterface.sequelize.transaction();

            try {
                // Supprime les vues dans l'ordre (dépendances d'abord)
                await views.reduce(
                    (promise, view) => promise.then(() => queryInterface.sequelize.query(
                        `DROP VIEW ${view.name}`,
                        { transaction },
                    )),
                    Promise.resolve(),
                );

                // Recrée les anciennes views in en ordre inverse (vues "base" d'abord)
                await views.toReversed().reduce(
                    (promise, view) => promise.then(() => queryInterface.sequelize.query(view.oldView, { transaction })),
                    Promise.resolve(),
                );

                return transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },
    };
};
