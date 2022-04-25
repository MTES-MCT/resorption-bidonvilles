import { postApi } from "#helpers/api/main";

/**
 * POST /me/navigationLogs
 */
export function insert(page) {
    return postApi("/me/navigationLogs", { page });
}
