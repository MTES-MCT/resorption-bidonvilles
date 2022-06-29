import { getApi } from "#src/js/api";

// GET /comments
export function getAll() {
    return getApi("/comments");
}

export default getAll;
