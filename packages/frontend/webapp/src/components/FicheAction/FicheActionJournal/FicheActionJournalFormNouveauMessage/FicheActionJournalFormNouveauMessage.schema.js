import { object, string } from "yup";
import labels from "./FicheActionJournalFormNouveauMessage.labels";
import commentModes from "@/utils/comment_modes";
import attachmentSchema from "@/utils/yup_attachment_schema";

export default object({
    comment: string().required().label(labels.comment),
    mode: string()
        .oneOf(commentModes.map(({ uid }) => uid))
        .required()
        .label(labels.mode),
    target: object()
        .when("mode", {
            is: "custom",
            then: (schema) => schema.required(),
        })
        .label(labels.target),
    attachments: attachmentSchema().required().label(labels.attachments),
});
