import { object, string, array, mixed } from "yup";
import { useConfigStore } from "@/stores/config.store";
import labels from "./FicheSiteJournalFormNouveauMessage.labels";
import commentModes from "@/utils/comment_modes";
import allowedFileExtensions from "@common/utils/allowed_file_extensions";
import fromMimeToExtension from "@common/utils/fromMimeToExtension";
import { MAX_FILE_SIZE } from "@common/utils/max_file_size";

const configStore = useConfigStore();

export default object({
    tags: array().of(
        string().oneOf(
            configStore.config.regular_comment_tags.map(({ uid }) => uid)
        )
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
    attachments: mixed()
        .required()
        .test(
            "is-valid-type",
            "Un ou plusieurs fichiers ont une extension non autorisée",
            (value) => {
                if (!value || value?.length <= 0) {
                    return true;
                }

                for (let i = 0; i < value.length; i++) {
                    if (
                        !allowedFileExtensions.includes(
                            fromMimeToExtension(value[i]?.type)?.toLowerCase()
                        )
                    ) {
                        return false;
                    }
                }

                return true;
            }
        )
        .test(
            "is-valid-size",
            "Un ou plusieurs fichiers dépasse(nt) la taille maximale autorisée",
            (value) => {
                if (!value || value?.length <= 0) {
                    return true;
                }

                for (let i = 0; i < value.length; i++) {
                    if (value[i]?.size > MAX_FILE_SIZE) {
                        return false;
                    }
                }

                return true;
            }
        )
        .label(labels.attachments),
});
