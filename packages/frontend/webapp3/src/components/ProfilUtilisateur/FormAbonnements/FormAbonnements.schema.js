import { object, array } from "yup";
import labels from "./FormAbonnements.labels";

export default object({
    email_subscriptions: array().label(labels),
});
