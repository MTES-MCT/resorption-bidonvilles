import { postApi } from "#helpers/api/main";

/**
 * POST /me/navigationLogs
 */
export function insert(data) {
    return postApi("/me/navigationLogs", data);
}
