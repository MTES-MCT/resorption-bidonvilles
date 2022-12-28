import { object, string } from "yup";
import labels from "./FicheQuestionNouvelleReponse.labels";

export default object({
    answer: string().required().label(labels.answer),
});
