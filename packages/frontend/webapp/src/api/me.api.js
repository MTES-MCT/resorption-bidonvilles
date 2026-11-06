import { axios } from "@/helpers/axios";
import { useUserStore } from "@/stores/user.store";

export function createNavigationLog(page) {
    return axios.post("/navigation-logs", { page, domain: "webapp" });
}

export function edit(data) {
    const userStore = useUserStore();
    const user = userStore.user;
    return axios.patch("/me", { ...data, id: user.id });
}
