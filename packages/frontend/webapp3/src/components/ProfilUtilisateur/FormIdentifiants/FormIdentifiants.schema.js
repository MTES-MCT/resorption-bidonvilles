import { object, string } from "yup";
import labels from "./FormIdentifiants.labels";

export default object({
    password: string().required().min(12).label(labels.password),
});
