import regionModel from '#server/models/regionModel/index';

const listAllRegions = async (): Promise<Array<{ id: string; name: string }>> => {
    const regions = await regionModel.findAll();
    return regions.map(region => ({
        id: region.code,
        name: `${region.code} - ${region.name}`,
    }));
};

export default listAllRegions;
