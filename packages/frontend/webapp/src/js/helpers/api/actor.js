import { getApi } from "#src/js/api";

export function exportActors() {
    return getApi("/actors");
}

export default exportActors;
