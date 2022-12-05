import { object, mixed } from "yup";
import labels from "./CharteEngagement.labels";

export default object({
    confidentiality_agreement: mixed()
        .required()
        .label(labels.confidentiality_agreement),
    charte_agreement: mixed().required().label(labels.charte_agreement),
});
