import axios from "axios";

export async function getCadastre(geojson) {
    const queries = [`geom=${encodeURIComponent(JSON.stringify(geojson))}`];
    const { data } = await axios.get(
        `https://apicarto.ign.fr/api/cadastre/parcelle?${queries.join("&")}`
    );

    return data;
}
