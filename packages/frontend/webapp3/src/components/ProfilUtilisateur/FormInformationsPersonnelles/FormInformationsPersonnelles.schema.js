import { object, string } from "yup";
import labels from "./FormInformationsPersonnelles.labels";

export default object({
    first_name: string().required().label(labels.first_name),
    last_name: string().required().label(labels.last_name),
    position: string().required().label(labels.position),
    phone: string().required().label(labels.phone),
});
