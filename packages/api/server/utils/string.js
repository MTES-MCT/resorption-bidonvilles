module.exports = {
    normalizeTownName(name) {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^0-9a-z]/gi, ' ')
            .replace(/^\s+|\s+$/g, '')
            .replace(/\s+/g, '_');
    },
};
