import axios from "axios";
import ENV from "@/helpers/env.js";

const { ADRESSE_API_URL } = ENV;

export async function searchAddress(search, limit = 5) {
    const normalizedSearch = (search ?? "").toString().trim();
    if (normalizedSearch.length < 3) {
        return [];
    }

    const queries = [`q=${encodeURIComponent(normalizedSearch)}`];

    const parsedLimit = Number.parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit)) {
        queries.push(`limit=${parsedLimit}`);
    }

    let data;
    try {
        ({ data } = await axios.get(`${ADRESSE_API_URL}?${queries.join("&")}`));
    } catch (e) {
        console.log("Erreur lors de la recherche de l'adresse", e);
        return [];
    }

    const features = Array.isArray(data?.features) ? data.features : [];

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
                coordinates: [...geometry.coordinates].reverse(),
            },
        });
        return acc;
    }, []);
}
