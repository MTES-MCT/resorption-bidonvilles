import {
    object,
    array,
    string,
    boolean,
    mixed,
    number,
    ref,
    addMethod,
} from "yup";
import labelsFn from "./FormUtilisateur.labels.js";

import requestTypes from "@/utils/access_request_types";
import organizationCategories from "@/utils/organization_categories";
import referrals from "@/utils/contact_referrals";

addMethod(object, "territorialCollectivity", function (schema) {
    return this.test(
        "territorialCollectivity",
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

export default (variant) => {
    const schema = {};
    const labels = labelsFn(variant);

    // personal information
    schema.email = string().required().email().label(labels.email);
    if (variant === "demande-acces") {
        schema.verif_email = string()
            .required()
            .oneOf([ref("email")], "Les deux courriels ne correspondent pas")
            .label(labels.verif_email);
    }
    schema.first_name = string().required().label(labels.first_name);
    schema.last_name = string().required().label(labels.last_name);
    const phone = string().label(labels.phone);
    schema.phone = variant === "demande-acces" ? phone.required() : phone;

    // request-type and is-actor
    if (variant === "demande-acces") {
        schema.request_type = array()
            .of(string().oneOf(requestTypes.map(({ value }) => value)))
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

    // organization category
    const organizationCategory = string().label(labels.organization_category);
    function makeOrganizationCategoryRequired(schema) {
        return schema
            .required()
            .oneOf(organizationCategories.map(({ value }) => value));
    }
    if (variant === "demande-acces") {
        schema.organization_category = organizationCategory.when("is_actor", {
            is: true,
            then: makeOrganizationCategoryRequired,
        });
    } else {
        schema.organization_category =
            makeOrganizationCategoryRequired(organizationCategory);
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
                schema.required().territorialCollectivity(
                    object({
                        data: object({
                            code: string().required(),
                            typeUid: string().required(),
                            typeName: string().required(),
                        }).required(),
                    })
                ),
        })
        .label(labels.territorial_collectivity);
    schema.association = string()
        .when("organization_category", {
            is: "association",
            then: (schema) => schema.required(),
        })
        .label(labels.association);
    schema.new_association_name = string()
        .when("association", {
            is: "autre",
            then: (schema) => schema.required(),
        })
        .label(labels.new_association_name);
    schema.new_association_abbreviation = string()
        .when("association", {
            is: "autre",
            then: (schema) => schema.required(),
        })
        .label(labels.new_association_abbreviation);
    schema.departement = string()
        .when("organization_category", {
            is: "association",
            then: (schema) => schema.required(),
        })
        .label(labels.departement);
    schema.organization_administration = string()
        .when("organization_category", {
            is: "administration",
            then: (schema) => schema.required(),
        })
        .label(labels.organization_administration);

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

    if (variant === "demande-acces") {
        schema.access_request_message = string()
            .required()
            .label(labels.access_request_message);
        schema.referral = string()
            .required()
            .oneOf(referrals.map(({ value }) => value))
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
