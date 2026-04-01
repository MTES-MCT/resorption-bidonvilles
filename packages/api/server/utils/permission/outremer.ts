type outremerDataset = {
    departements: string[],
    regions: string[],
};

type outremerCodes = {
    departements: string,
    regions: string,
};

const outremer: outremerDataset = {
    departements: ['971', '972', '973', '974', '975', '976', '977', '978', '984', '986', '987', '988', '989'],
    regions: ['01', '02', '03', '04', '06'],
};
const codesOutreMer: outremerCodes = {
    departements: outremer.departements.map(code => `'${code}'`).join(','),
    regions: outremer.regions.map(code => `'${code}'`).join(','),
};

export { outremer, codesOutreMer };
