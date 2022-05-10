const query = require('./_common/query');

module.exports = (user, latitude, longitude, distance, closed = false) => {
    const distanceCalc = '(6371 * 2 * ASIN(SQRT( POWER(SIN(( :latitude - shantytowns.latitude) *  pi()/180 / 2), 2) +COS( :latitude * pi()/180) * COS(shantytowns.latitude * pi()/180) * POWER(SIN(( :longitude - shantytowns.longitude) * pi()/180 / 2), 2) )))';

    return query(
        [
            {
                distance: {
                    query: distanceCalc, operator: '<', value: distance,
                },
            },
            {
                is_closed: {
                    query: 'shantytowns.closed_at', not: closed === true, value: null,
                },
            },
        ],
        undefined,
        user,
        'list',
        false,
        // SQL
        {
            selection: {
                [`${distanceCalc}`]: 'distance',
            },
        },
        // replacements:
        {
            latitude,
            longitude,
            distanceRadius: distance,
        },
    );
};
