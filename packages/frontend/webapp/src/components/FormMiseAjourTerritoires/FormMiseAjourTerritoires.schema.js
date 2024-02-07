import { object, array } from "yup";
import labels from "./FormMiseAjourTerritoires.labels";

export default object({
    organization_areas: array()
        .required(`Le champ ${labels.organization_areas} est obligatoire`)
        .min(1, `Le champ ${labels.organization_areas} est obligatoire`)
        .label(labels.organization_areas),
    user_areas: array()
        .required(`Le champ ${labels.user_areas} est obligatoire`)
        .label(labels.user_areas),
});
