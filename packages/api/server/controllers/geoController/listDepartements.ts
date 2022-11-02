import departementModel from '#server/models/departementModel/index';

export default async (req, res) => res.status(200).send({
    departements: await departementModel.findAll(),
});
