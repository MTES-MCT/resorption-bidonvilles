import { mixed } from "yup";
import allowedFileExtensions from "@common/utils/allowed_file_extensions";
import fromMimeToExtension from "@common/utils/fromMimeToExtension";
import { MAX_FILE_SIZE } from "@common/utils/max_file_size";

export default () =>
    mixed()
        .test(
            "is-valid-name",
            "Un ou plusieurs fichiers ont un nom contenant un ou des caractères interdits (:, /, <, >, ...)",
            (value) => {
                if (!value || value?.length <= 0) {
                    return true;
                }

                for (let i = 0; i < value.length; i++) {
                    if (/[\\:/<>]/.test(value[i]?.name)) {
                        return false;
                    }
                }

                return true;
            }
        )
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
        );
