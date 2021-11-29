import { getApi } from "#helpers/api/main";

// GET /comments
export function getAll() {
    return getApi("/comments");
}

export default getAll;
