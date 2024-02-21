import organizationTypeModel from '#server/models/organizationTypeModel';

export default async (req, res) => res.status(200).send(await organizationTypeModel.findAll());
