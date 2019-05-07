import { getApi, postApi } from '#helpers/api/main';

export function list() {
    return getApi('/ngos');
}

export function search(q) {
    return getApi(`/ngos/search?q=${encodeURIComponent(q)}`);
}

export function create(data) {
    return postApi('/ngos', data);
}

export default create;
