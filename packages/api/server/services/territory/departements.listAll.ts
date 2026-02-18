import departementModel from '#server/models/departementModel/index';

const listAllDepartements = async (): Promise<Array<{ id: string; name: string }>> => {
    const departements = await departementModel.findAll();
    return departements.map(departement => ({
        id: departement.code,
        name: `${departement.code} - ${departement.name}`,
    }));
};

export default listAllDepartements;
