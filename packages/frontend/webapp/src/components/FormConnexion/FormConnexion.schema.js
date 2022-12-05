import { object, string } from "yup";
import labels from "./FormConnexion.labels.js";

export default object({
    email: string().required().email().label(labels.email),
    password: string().required().label(labels.password),
});
