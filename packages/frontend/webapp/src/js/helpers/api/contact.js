import { postApi } from "#src/js/api";

/**
 * POST /contact
 */
export function contact(data) {
    return postApi("/contact", data);
}

export default contact;
