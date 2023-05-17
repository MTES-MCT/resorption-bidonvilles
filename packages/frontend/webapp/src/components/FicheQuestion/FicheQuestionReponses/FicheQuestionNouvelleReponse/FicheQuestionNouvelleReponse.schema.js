import { object, string } from "yup";
import labels from "./FicheQuestionNouvelleReponse.labels";
import yup_attachment_schema from "@/utils/yup_attachment_schema";

export default object({
    answer: string().required().label(labels.answer),
    attachments: yup_attachment_schema().label(labels.attachments),
});
