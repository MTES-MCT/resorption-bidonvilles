import { object, array } from "yup";
import labels from "./FormSujets.labels";

export default object({
    tags: array().required().label(labels.tags),
});
