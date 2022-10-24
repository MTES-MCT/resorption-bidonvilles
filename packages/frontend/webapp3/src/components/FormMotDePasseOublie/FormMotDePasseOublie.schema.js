import { object, string } from "yup";
import labels from "./FormMotDePasseOublie.labels.js";

export default object({
    email: string().required().email().label(labels.email),
});
