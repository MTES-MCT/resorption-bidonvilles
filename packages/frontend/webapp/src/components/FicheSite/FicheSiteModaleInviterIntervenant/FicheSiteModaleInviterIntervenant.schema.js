import { object, string } from "yup";
import labels from "./FicheSiteModaleInviterIntervenant.labels";

export default object({
    email: string().label(labels.email),
    user: object(),
});
