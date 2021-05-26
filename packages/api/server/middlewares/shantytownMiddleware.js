
module.exports = models => ({
    async checkReadPermission(req, res, next) {
        if (!req.user || !req.user.isAllowedTo('read', 'shantytown')) {
            res.status(400).send({
                user_message: 'Vous n\'avez pas accès à ces données',
            });
            return;
        }

        try {
            req.shantytown = await models.shantytown.findOne(req.user, parseInt(req.params.id, 10));
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur de lecture en base de données est survenue',
            });
            return;
        }

        if (req.shantytown === null) {
            res.status(404).send({
                user_message: 'Le site demandé n\'existe pas ou vous n\'y avez pas accès',
            });
            return;
        }

        next();
    },
});
