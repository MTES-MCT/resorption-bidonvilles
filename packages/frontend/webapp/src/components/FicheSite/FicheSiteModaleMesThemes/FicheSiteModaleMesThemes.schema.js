import { object, array, string } from "yup";
import labels from "./FicheSiteModaleMesThemes.labels";

export default object({
    themes: array().required().label(labels.themes),
    other: string().label(labels.other),
});
