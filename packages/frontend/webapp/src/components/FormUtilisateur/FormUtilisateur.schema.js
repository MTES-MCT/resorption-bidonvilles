import {
    object,
    array,
    string,
    boolean,
    mixed,
    number,
    ref,
    addMethod,
    setLocale,
} from "yup";
import { fr } from "yup-locales";
import labelsFn from "./FormUtilisateur.labels.js";

import requestTypes from "@/utils/access_request_types";
import referrals from "@/utils/contact_referrals";

const locales = {
    fr: {
        string: {
            verif_email: "Les deux courriels ne correspondent pas",
        },
    },
    en: {
        mixed: {
            required: (value) => `${value.label} is required`,
        },
        string: {
            email: (value) => `${value.label} must be a valid email`,
            verif_email: "the two emails do not match",
        },
    },
    ro: {
        mixed: {
            required: (value) => `${value.label} este necesară`,
        },
        string: {
            email: (value) => `${value.label} trebuie să fie un e-mail valid`,
            verif_email: "cele două e-mailuri nu se potrivesc",
        },
    },
    bg: {
        mixed: {
            required: (value) => `${value.label} изисква се`,
        },
        string: {
            email: (value) => `${value.label} трябва да е валиден имейл`,
            verif_email: "двата имейла не съвпадат",
        },
    },
};

addMethod(object, "customSchema", function (schema) {
    return this.test(
        "customSchema",
        ({ label }) => `${label} est techniquement invalide`,
        async function (value) {
            if (value === undefined || value === null) {
                return true;
            }

            try {
                await schema.validate(value);
                return true;
            } catch (error) {
                return false;
            }
        }
    );
});

export default (
    variant,
    allowNewOrganization,
    allowPrivateOrganization,
    language
) => {
    const schema = {};
    const labels = labelsFn(variant)[language];

    if (language === "fr") {
        setLocale(fr);
    } else {
        setLocale(locales[language]);
    }

    // personal information
    schema.email = string().required().email().label(labels.email);
    if (variant === "demande-acces") {
        schema.verif_email = string()
            .required()
            .oneOf([ref("email")], locales[language].string.verif_email)
            .label(labels.verif_email);
    }
    schema.first_name = string().required().label(labels.first_name);
    schema.last_name = string().required().label(labels.last_name);
    const phone = string().label(labels.phone);
    schema.phone = variant === "demande-acces" ? phone.required() : phone;

    // request-type and is-actor
    if (variant === "demande-acces") {
        schema.request_type = array()
            .of(
                string().oneOf(requestTypes[language].map(({ value }) => value))
            )
            .required()
            .min(1, ({ label }) => `${label} est un champ obligatoire`)
            .label(labels.request_type);
        schema.is_actor = boolean()
            .when("request_type", {
                is: (val) => val?.includes("access-request"),
                then: (schema) => schema.required(),
            })
            .label(labels.is_actor);
    }

    // organization type
    schema.organization_type = number()
        .when("organization_category", {
            is: "public_establishment",
            then: (schema) => schema.required(),
        })
        .label(labels.organization_type);

    schema.organization_public = number()
        .when("organization_type", {
            is: (type) => !!type,
            then: (schema) => schema.required(),
        })
        .label(labels.organization_public);
    schema.territorial_collectivity = object()
        .when("organization_category", {
            is: "territorial_collectivity",
            then: (schema) =>
                schema.required().customSchema(
                    object({
                        data: object({
                            id: number().required(),
                        }).required(),
                    })
                ),
        })
        .label(labels.territorial_collectivity);
    schema.association = object()
        .when("organization_category", {
            is: "association",
            then: (schema) =>
                schema.required().customSchema(
                    object({
                        data: object({
                            id: number().required(),
                        }).required(),
                    })
                ),
        })
        .label(labels.association);
    schema.organization_administration = string()
        .when("organization_category", {
            is: "administration",
            then: (schema) => schema.required(),
        })
        .label(labels.organization_administration);
    schema.private_organization = object()
        .when("organization_category", {
            is: "private_organization",
            then: (schema) =>
                schema.required().customSchema(
                    object({
                        data: object({
                            id: number().required(),
                        }).required(),
                    })
                ),
        })
        .label(labels.private_organization);
    schema.organization_other = string()
        .when("organization_category", {
            is: "other",
            then: (schema) => schema.required(),
        })
        .label(labels.organization_other);
    schema.organization_other_territory = string()
        .when("organization_category", {
            is: "other",
            then: (schema) => schema.required(),
        })
        .label(labels.organization_other_territory);
    const position = string().label(labels.position);
    function makePositionRequired(schema) {
        return schema.required();
    }
    if (variant === "demande-acces") {
        schema.position = position.when(["is_actor", "organization_category"], {
            is: (is_actor, organization_category) =>
                is_actor === true && !!organization_category,
            then: makePositionRequired,
        });
    } else {
        schema.position = position.when("organization_category", {
            is: (organization_category) => !!organization_category,
            then: makePositionRequired,
        });
    }

    if (variant === "demande-acces" && language === "fr") {
        schema.access_request_message = string()
            .required()
            .label(labels.access_request_message);
        schema.referral = string()
            .required()
            .oneOf(referrals[language].map(({ value }) => value))
            .label(labels.referral);
        schema.referral_other = string()
            .when("referral", {
                is: "other",
                then: (schema) => schema.required(),
            })
            .label(labels.referral_other);
        schema.referral_word_of_mouth = string()
            .when("referral", {
                is: "word_of_mouth",
                then: (schema) => schema.required(),
            })
            .label(labels.referral_word_of_mouth);
    }

    schema.legal = mixed().required().label(labels.legal);
    return object(schema);
};
