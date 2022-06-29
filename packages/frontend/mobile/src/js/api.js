import { createApi } from "#frontend/common/api/main";

const api = createApi("https://api.resorption-bidonvilles.localhost", "1.0.0");
export default api;

const { getApi, postApi, patchApi, putApi, deleteApi, open } = api;
export { getApi, postApi, patchApi, putApi, deleteApi, open };
