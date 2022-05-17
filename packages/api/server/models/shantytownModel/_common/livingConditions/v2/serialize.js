module.exports = town => ({
    version: town.livingConditionsVersion,
    electricity: {
        status: { status: 'unknown' },
    },
    water: {
        status: { status: 'unknown' },
    },
    trash: {
        status: { status: 'unknown' },
    },
    sanitary: {
        status: { status: 'unknown' },
    },
    vermin: {
        status: { status: 'unknown' },
    },
    firePrevention: {
        status: { status: 'unknown' },
    },
});
