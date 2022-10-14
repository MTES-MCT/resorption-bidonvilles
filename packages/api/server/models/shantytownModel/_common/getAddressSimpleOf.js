module.exports = (address) => {
    const reg = address.match(/^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$/);
    if (!reg) {
        return 'Pas d\'adresse précise';
    }
    return reg[1];
};
