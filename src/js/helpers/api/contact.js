import { postApi } from "#helpers/api/main";

/**
 * POST /contact
 */
export function contact(data) {
    return postApi("/contact", data);
}

export default contact;
