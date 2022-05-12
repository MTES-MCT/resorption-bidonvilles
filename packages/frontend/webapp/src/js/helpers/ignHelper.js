function onLoad(success, failure) {
    if (this.status !== 200) {
        failure();
        return;
    }

    try {
        success(JSON.parse(this.responseText));
    } catch (error) {
        failure();
    }
}

/**
 * @param {Object} geojson
 *
 * @returns {Promise}
 */
export function getCadastre(geojson) {
    const xhr = new XMLHttpRequest();
    const promise = new Promise((success, failure) => {
        const queries = [`geom=${encodeURIComponent(JSON.stringify(geojson))}`];

        xhr.open(
            "GET",
            `https://apicarto.ign.fr/api/cadastre/parcelle?${queries.join("&")}`
        );
        xhr.onload = onLoad.bind(xhr, success, failure);
        xhr.onerror = failure;
        xhr.ontimeout = failure;
        xhr.send();
    });
    promise.abort = () => {
        xhr.abort();
    };

    return promise;
}

export function generateSquare(center, radius) {
    const cross = Math.sqrt(2 * radius ** 2);
    const coordinates = [];

    for (let i = 0; i < 4; i++) {
        coordinates.push(
            turf.destination(center, cross, (i * -360) / 4 + 45, {}).geometry
                .coordinates
        );
    }
    coordinates.push(coordinates[0]);

    return turf.polygon([coordinates], {}).geometry;
}

export default getCadastre;
