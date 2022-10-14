module.exports = (address) => {
    if (!address) {
        return 'Pas d\'adresse précise';
    }
    const reg = address.match(/^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$/);
    if (!reg) {
        return 'Pas d\'adresse précise';
    }
    return reg[1];
};
