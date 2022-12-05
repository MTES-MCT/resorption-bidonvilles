import { object, string, ref } from "yup";
import labels from "./FormChangementMotDePasse.labels.js";

export default object({
    password: string().required().min(12).label(labels.password),
    password_confirm: string()
        .required()
        .oneOf([ref("password")], "Les deux mot de passe ne correspondent pas")
        .label(labels.password_confirm),
});
