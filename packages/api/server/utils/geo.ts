module.exports = {
    fromGeoLevelToTableName(geoLevel) {
        switch (geoLevel) {
            case 'region':
                return 'regions';

            case 'departement':
                return 'departements';

            case 'epci':
                return 'epci';

            case 'city':
                return 'cities';

            default:
                return null;
        }
    },
};
