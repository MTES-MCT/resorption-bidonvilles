import { object, array } from "yup";
import labels from "./FormSujets.labels";

export default object({
    expertise_topics: array().required().label(labels.expertise_topics),
    interest_topics: array().required().label(labels.interest_topics),
});
