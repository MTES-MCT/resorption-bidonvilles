import { axios } from "@/helpers/axios";

export function addFavorite(townId) {
    return axios.post(`/towns/${encodeURI(townId)}/favorites`);
}

export function removeFavorite(townId) {
    return axios.delete(`/towns/${encodeURI(townId)}/favorites`);
}

export function fetchFavorites() {
    return axios.get("/users/me/favorites");
}
