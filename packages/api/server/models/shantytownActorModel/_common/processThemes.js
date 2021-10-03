/**
 * Processes an array of themes to make it ready for database insertion
 *
 * @param {Array.<Object>} themes Each object has the property "id", and for the special case "autre" a property "value"
 *
 * @returns {Object} A key-value object with a key "themes" (array of theme ids) and a key "autre" (string or null)
 */
module.exports = themes => themes.reduce((acc, theme) => {
    if (theme.id === 'autre') {
        return {
            ...acc,
            autre: theme.value,
        };
    }

    return {
        ...acc,
        themes: [
            ...acc.themes,
            theme.id,
        ],
    };
}, {
    themes: [],
    autre: null,
});
