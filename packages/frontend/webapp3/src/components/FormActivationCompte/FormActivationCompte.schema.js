import { object, string } from "yup";
import labels from "./FormActivationCompte.labels.js";

export default object({
    email: string().required().email().label(labels.email),
    password: string().required().min(12).label(labels.password),
});
