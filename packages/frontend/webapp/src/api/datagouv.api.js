import axios from "axios";

export async function searchAddress(search, limit = 5) {
    const queries = [`q=${encodeURIComponent(search)}`];

    const parsedLimit = parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit)) {
        queries.push(`limit=${parsedLimit}`);
    }

    const {
        data: { features },
    } = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?${queries.join("&")}`
    );

    const usedUids = {};
    return features.reduce((acc, feature) => {
        if (!feature?.properties?.citycode) {
            return acc;
        }

        const { properties, geometry } = feature;

        // avoid duplicates
        const uid = `${geometry.coordinates[0]}-${geometry.coordinates[1]}`;
        if (usedUids[uid] !== undefined) {
            return acc;
        }

        usedUids[uid] = true;
        acc.push({
            addressType: properties.type,
            citycode: properties.citycode,
            city: properties.city,
            coordinates: geometry.coordinates,
            id: properties.id,
            label: `${properties.label}, ${properties.context}`,
            category: "Adresse",
            data: {
                citycode: properties.citycode,
                city: properties.city,
                label: `${properties.label}, ${properties.context}`,
                coordinates: geometry.coordinates.reverse(),
            },
        });
        return acc;
    }, []);
}
