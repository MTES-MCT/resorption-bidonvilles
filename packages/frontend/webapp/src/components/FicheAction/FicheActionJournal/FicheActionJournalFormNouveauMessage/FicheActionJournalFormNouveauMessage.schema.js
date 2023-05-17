import { object, string } from "yup";
import labels from "./FicheActionJournalFormNouveauMessage.labels";
import attachmentSchema from "@/utils/yup_attachment_schema";

export default object({
    comment: string().required().label(labels.comment),
    attachments: attachmentSchema().required().label(labels.attachments),
});
