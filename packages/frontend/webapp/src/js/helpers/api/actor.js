import { getApi } from "#helpers/api/main";

export function exportActors() {
    return getApi("/actors");
}

export default exportActors;
