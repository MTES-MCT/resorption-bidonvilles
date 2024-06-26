import { object, string, array } from "yup";
import { useConfigStore } from "@/stores/config.store";
import labels from "./FicheSiteJournalFormNouveauMessage.labels";
import commentModes from "@/utils/comment_modes";
import attachmentSchema from "@/utils/yup_attachment_schema";

const configStore = useConfigStore();

export default object({
    tags: array().of(
        string().oneOf(configStore.config.comment_tags.map(({ uid }) => uid))
    ),
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
