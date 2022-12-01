<template>
    <LayoutForm>
        <template v-slot:title>Fermeture du site</template>
        <template v-slot:subtitle>
            {{ town.addressSimple
            }}<template v-if="town.name"> « {{ town.name }} »</template>
        </template>
        <template v-slot:buttons>
            <Button variant="primaryOutline" type="button" @click="back"
                >Annuler</Button
            >
            <Button @click="submit">Valider</Button>
        </template>

        <ContentWrapper size="intermediate">
            <FormFermetureDeSite :town="town" :mode="mode" :error="error" />
        </ContentWrapper>
    </LayoutForm>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useForm } from "vee-validate";
import { useNotificationStore } from "@/stores/notification.store";
import router from "@/helpers/router";
import { close, setClosedWithSolutions } from "@/api/towns.api";
import { trackEvent } from "@/helpers/matomo";

import { Button } from "@resorptionbidonvilles/ui";
import ContentWrapper from "../ContentWrapper/ContentWrapper.vue";
import LayoutForm from "@/components/LayoutForm/LayoutForm.vue";
import FormFermetureDeSite from "./FormFermetureDeSite.vue";
import schemaFn from "./FormFermetureDeSite.schema";
import formatDate from "@/utils/formatDate";
import { useTownsStore } from "@/stores/towns.store";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const error = ref(null);
const mode = computed(() => {
    return town.value.closedAt !== null ? "fix" : "declare";
});
const schema = computed(() => {
    return schemaFn(mode.value);
});

const config = {
    declare: {
        async submit(values) {
            const updatedTown = await close(town.value.id, {
                closed_at: formatDate(values.closed_at / 1000, "y-m-d"),
                status: values.status,
                closing_context: values.closing_context,
                solutions: values.solutions.map((id) => {
                    return {
                        id,
                        ...values.solution_details[id],
                    };
                }),
                closed_with_solutions: values.closed_with_solutions,
            });

            trackEvent("Site", "Fermeture site", `S${town.value.id}`);

            if (values.closed_with_solutions) {
                trackEvent("Site", "Résorption du site", `S${town.value.id}`);
            }

            return updatedTown;
        },
        successTitle: "Fermeture du site",
        successWording:
            "Le site a bien été déclaré comme fermé. Les acteurs concernés ont été prévenus par mail",
    },
    fix: {
        submit(values) {
            return setClosedWithSolutions(town.value.id, {
                closed_with_solutions: values.closed_with_solutions,
            });
        },
        successTitle: "Correction de la fermeture",
        successWording:
            "Les données relatives à la fermeture du site ont bien été modifiées",
    },
};

const { handleSubmit, setErrors } = useForm({
    validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
    const { submit, successTitle, successWording } = config[mode.value];
    const townsStore = useTownsStore();
    const notificationStore = useNotificationStore();
    error.value = null;

    try {
        const updatedTown = await submit(values);
        townsStore.setTown(town.value.id, updatedTown);
        notificationStore.success(successTitle, successWording);

        router.replace(`/site/${town.value.id}`);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

function back() {
    router.back();
}
</script>
