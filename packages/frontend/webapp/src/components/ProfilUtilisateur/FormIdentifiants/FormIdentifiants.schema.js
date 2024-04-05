import { object, string } from "yup";
import labels from "./FormIdentifiants.labels";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

export default object({
    password: string()
        .required()
        .min(userStore.user.is_admin ? 16 : 12)
        .label(labels.password),
});
