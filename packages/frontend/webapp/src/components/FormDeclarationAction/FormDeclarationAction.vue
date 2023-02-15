<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>

        <FormDeclarationActionCaracteristiques class="mt-6" />
        <FormDeclarationActionLocalisation class="mt-6" />
        <FormDeclarationActionContacts class="mt-6" />
        <FormDeclarationActionIndicateurs class="mt-6" />

        <ErrorSummary
            id="erreurs"
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </ArrangementLeftMenu>
</template>

<script setup>
import { defineProps, toRefs, computed, defineExpose, ref } from "vue";
import { useForm } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import isDeepEqual from "@/utils/isDeepEqual";
import backOrReplace from "@/utils/backOrReplace";
import formatFormAction from "@/utils/formatFormAction";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormDeclarationActionCaracteristiques from "./sections/FormDeclarationActionCaracteristiques.vue";
import FormDeclarationActionLocalisation from "./sections/FormDeclarationActionLocalisation.vue";
import FormDeclarationActionContacts from "./sections/FormDeclarationActionContacts.vue";
import FormDeclarationActionIndicateurs from "./sections/FormDeclarationActionIndicateurs.vue";
import schemaFn from "./FormDeclarationAction.schema";
import formatFormDate from "@/utils/formatFormDate";

const props = defineProps({
    action: {
        type: Object,
        required: false,
        default: null,
    },
});
const { action } = toRefs(props);

const userStore = useUserStore();
const initialValues = {
    ...formatFormAction(
        action.value || {
            location_departement: userStore.departementsForActions[0]?.code,
        }
    ),
    date_indicateurs:
        action.value?.created_at &&
        new Date(action.value.created_at).getFullYear() !== 2023
            ? new Date("December 31, 2022 00:00:00")
            : new Date(),
};

const mode = computed(() => {
    return action.value === null ? "create" : "edit";
});
const validationSchema = schemaFn(mode.value);
const { handleSubmit, values, errors, setErrors } = useForm({
    validationSchema,
    initialValues,
});

const originalValues = formatValuesForApi(values);
const actionsStore = useActionsStore();
const error = ref(null);

const tabs = [
    {
        id: "intervention",
        label: "Intervention",
        route: "#intervention",
    },
    {
        id: "lieu",
        label: "Lieu",
        route: "#lieu",
    },
    {
        id: "contacts",
        label: "Contacts",
        route: "#contacts",
    },
    {
        id: "indicateurs",
        label: "Indicateurs",
        route: "#indicateurs",
    },
];

const config = {
    create: {
        async submit(values) {
            const action = await actionsStore.create(values);
            trackEvent("Action", "Création action", `A${action.id}`);
            return action;
        },
        notification: {
            title: "Déclaration réussie",
            content:
                "L'action a été déclarée, et les acteurs concernés ont été prévenus par mail",
        },
    },
    edit: {
        async submit(values, id) {
            const action = await actionsStore.edit(id, values);
            trackEvent("Action", "Mise à jour action", `A${id}`);
            return action;
        },
        notification: {
            title: "Mise à jour réussie",
            content: "L'action a bien été mise à jour",
        },
    },
};

function formatValuesForApi(v) {
    let citycode = null;
    let label = null;
    if (v.location_eti?.data) {
        ({ citycode, label } = v.location_eti.data);
    }

    return {
        ...Object.keys(validationSchema.fields).reduce((acc, key) => {
            acc[key] = v[key];
            return acc;
        }, {}),
        ...{
            started_at: formatFormDate(v.started_at),
            ended_at: formatFormDate(v.ended_at),
            date_indicateurs: v.date_indicateurs,
            managers: v.managers.users.map(({ id }) => id),
            operators: v.operators.users.map(({ id }) => id),
            location_eti_citycode: citycode,
            location_eti: label,
            location_eti_coordinates: v.location_eti_coordinates
                ? `${v.location_eti_coordinates[0]},${v.location_eti_coordinates[1]}`
                : "",
        },
    };
}

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues);

        if (
            mode.value === "edit" &&
            isDeepEqual(originalValues, formattedValues)
        ) {
            router.replace("#erreurs");
            error.value =
                "Modification impossible : aucun champ n'a été modifié";
            return;
        }

        error.value = null;

        try {
            const notificationStore = useNotificationStore();

            const { submit, notification } = config[mode.value];
            const respondedAction = await submit(
                formattedValues,
                action.value?.id
            );

            notificationStore.success(notification.title, notification.content);
            backOrReplace(`/action/${respondedAction.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
});
</script>
