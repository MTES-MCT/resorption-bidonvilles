import { object, string, ref } from "yup";
import labels from "./FormIdentifiants.labels";
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();

export default object({
    actualPassword: string().required().label(labels.actualPassword),
    newPassword: string()
        .required()
        .min(userStore.user.is_admin ? 16 : 12)
        .label(labels.password),
    retypeNewPassword: string()
        .required()
        .oneOf(
            [ref("newPassword"), null],
            "Les mots de passe ne correspondent pas"
        )
        .label(labels.retypeNewPassword),
});
