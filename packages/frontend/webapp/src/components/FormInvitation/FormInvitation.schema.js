import { object, string } from "yup";
import labels from "./FormInvitation.labels.js";

export default object({
    email: string().required().email().label(labels.email),
    first_name: string()
        .required()
        .label(labels.first_name)
        .matches(/^[^<>{}]*$/, "Le prénom n'est pas correctement renseigné"),
    last_name: string()
        .required()
        .label(labels.last_name)
        .matches(/^[^<>{}]*$/, "Le nom n'est pas correctement renseigné"),
});
