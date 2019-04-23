import { getApi, postApi } from '#helpers/api/main';

export function list() {
    return getApi('/operators');
}

export function search(q) {
    return getApi(`/operators/search?q=${encodeURIComponent(q)}`);
}

export function create(data) {
    return postApi('/operators', data);
}

export default create;
