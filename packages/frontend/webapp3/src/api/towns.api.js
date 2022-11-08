import { axios } from "@/helpers/axios";

export function addActor(townId, actor) {
    return axios.post(`/towns/${encodeURI(townId)}/actors`, actor);
}

export function inviteNewActor(townId, email) {
    return axios.put(`/towns/${encodeURI(townId)}/invitations`, { email });
}

export function fetch(id) {
    return axios.get(`/towns/${encodeURI(id)}`);
}

export function fetchList() {
    return axios.get("/towns");
}

export function findRelations(townId, query) {
    return axios.get(
        `/towns/${encodeURI(townId)}/relations?q=${encodeURIComponent(query)}`
    );
}

export function exportList(
    location,
    closedTowns,
    options = [],
    date = new Date()
) {
    const query = {
        locationType: location.type,
        locationCode: location.code,
        closedTowns: closedTowns ? "1" : "0",
        date: date.getTime(),
    };
    if (options?.length > 0) {
        query.options = options.join(",");
    }

    const queryString = Object.keys(query)
        .map((key) => `${key}=${encodeURIComponent(query[key])}`)
        .join("&");
    return axios.get(`/towns/export?${queryString}`, { responseType: "blob" });
}

export function findNearby(latitude, longitude) {
    return axios.get(
        `/towns/findNearby?latitude=${encodeURIComponent(
            latitude
        )}&longitude=${encodeURIComponent(longitude)}`
    );
}

export function removeActor(townId, userId) {
    return axios.delete(
        `/towns/${encodeURI(townId)}/actors/${encodeURI(userId)}`
    );
}

export function removeActorTheme(townId, userId, themeId) {
    return axios.delete(
        `/towns/${encodeURI(townId)}/actors/${encodeURI(
            userId
        )}/themes/${encodeURI(themeId)}`
    );
}

export function setHeatwaveStatus(id, status) {
    return axios.put(`/towns/${encodeURI(id)}/heatwave`, {
        heatwave_status: status,
    });
}

export function updateActorThemes(townId, userId, themes) {
    return axios.put(
        `/towns/${encodeURI(townId)}/actors/${encodeURI(userId)}`,
        { themes }
    );
}
