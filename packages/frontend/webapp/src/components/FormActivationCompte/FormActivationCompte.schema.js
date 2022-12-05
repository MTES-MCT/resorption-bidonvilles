import { object, string, ref } from "yup";
import labels from "./FormActivationCompte.labels.js";

export default object({
    email: string().required().email().label(labels.email),
    password: string().required().min(12).label(labels.password),
    password_confirm: string()
        .required()
        .oneOf([ref("password")], "Les mots de passe ne correspondent pas")
        .label(labels.password_confirm),
});
