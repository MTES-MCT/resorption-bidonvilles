import { postApi } from "#helpers/api/main";

/**
 * POST /me
 */
export function insert(data) {
    return postApi("/me/navigationLogs", data);
}
