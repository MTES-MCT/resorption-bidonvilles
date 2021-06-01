
module.exports = models => async (req, res, next) => {
    let users;
    try {
        users = await models.user.findForRegion(req.shantytown.region.code, req.query.q || undefined);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }

    // filter users that are already marked as actors for this town
    const actors = req.shantytown.actors.map(({ id }) => id);
    return res.status(200).send({
        relations: users.filter(({ id }) => !actors.includes(id) && id !== req.user.id),
    });
};
