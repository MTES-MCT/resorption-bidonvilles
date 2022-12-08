import { postApi } from "#src/js/api";

/**
 * POST /me/navigationLogs
 */
export function insert(page, origin = null) {
    return postApi("/me/navigationLogs", { page, domain: "mobile", origin });
}
