import departementModelFactory from '#server/models/departementModel/index';

const departementModel = departementModelFactory();

export default async (req, res) => res.status(200).send({
    departements: await departementModel.findAll(),
});
