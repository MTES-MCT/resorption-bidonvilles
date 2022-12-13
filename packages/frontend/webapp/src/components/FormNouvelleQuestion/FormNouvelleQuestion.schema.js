import { object, string, number, array } from "yup";
import { useConfigStore } from "@/stores/config.store";
import labels from "./FormNouvelleQuestion.labels";

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
    people_affected: number().label(labels.people_affected),
    details: string().required().label(labels.details),
});
