import { object, array, string } from "yup";
import labels from "./FormSujets.labels";

export default object({
    expertise_topics: array().required().label(labels.expertise_topics),
    interest_topics: array().required().label(labels.interest_topics),
    expertise_comment: string().nullable().label(labels.expertise_comment),
});
