import { object, string, number, array } from "yup";
import { useConfigStore } from "@/stores/config.store";
import labels from "./FormNouvelleQuestion.labels";
import yup_attachment_schema from "@/utils/yup_attachment_schema";

function emptyStringToNull(value, originalValue) {
    if (typeof originalValue === "string" && originalValue === "") {
        return null;
    }

    return value;
}

const configStore = useConfigStore();

export default object({
    question: string().required().label(labels.question),
    tags: array()
        .of(
            string().oneOf([
                ...configStore.config.question_tags.map(({ uid }) => uid),
                "other",
            ])
        )
        .label(labels.tags),
    other_tag: string().label(labels.other_tag),
    people_affected: number()
        .typeError(`Nombre de personnes doit être un nombre`)
        .nullable()
        .transform(emptyStringToNull)
        .min(0)
        .label(labels.people_affected),
    details: string().required().label(labels.details),
    attachments: yup_attachment_schema().label(labels.attachments),
});
