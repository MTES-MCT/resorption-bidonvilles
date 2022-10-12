const departementModel = require('#server/models/departementModel/index');

module.exports = async (req, res) => res.status(200).send({
    departements: await departementModel.findAll(),
});
