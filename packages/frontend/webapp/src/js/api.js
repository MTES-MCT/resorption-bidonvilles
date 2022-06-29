import { createApi } from "#frontend/common/api/main";
import { VUE_APP_API_URL, APP_VERSION } from "#src/js/env.js";

const api = createApi(VUE_APP_API_URL, APP_VERSION);
export default api;

const { getApi, postApi, patchApi, putApi, deleteApi, open } = api;
export { getApi, postApi, patchApi, putApi, deleteApi, open };
