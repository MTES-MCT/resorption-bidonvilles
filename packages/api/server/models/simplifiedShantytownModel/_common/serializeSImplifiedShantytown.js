module.exports = (town) => {
    const serializedTown = {
        type: 'simplifiedShantytown',
        id: town.id,
        name: town.name,
        address: town.address,
        closedAt: town.closedAt !== null ? (town.closedAt.getTime() / 1000) : null,
    };
    return serializedTown;
};
