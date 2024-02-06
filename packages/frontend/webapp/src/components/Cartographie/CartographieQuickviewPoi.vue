<template>
    <PanneauLateral ref="panel" @close="emit('close')">
        <template v-slot:header>
            <p>
                <Icon icon="cutlery" class="mr-2" />
                <span class="font-bold">Point de distribution alimentaire</span>
            </p>
            <p class="text-sm text-G700">
                source: <Link to="https://soliguide.fr">soliguide.fr</Link>
            </p>
        </template>

        <section
            class="mt-6"
            v-for="(section, index) in filteredSections"
            :key="index"
        >
            <h1 class="text-primary font-bold text-lg">{{ section.title }}</h1>
            <div class="grid grid-cols-2 gap-3">
                <p
                    v-for="row in section.rows"
                    :key="row.label"
                    class="whitespace-pre-line break-words"
                >
                    <span class="font-bold" v-if="row.label">
                        {{ row.label }} </span
                    ><br />
                    <span>{{ row.value }}</span>
                </p>
            </div>
        </section>

        <p class="text-sm mt-8 text-center" v-if="poi?.lieu">
            <Button
                type="button"
                @click="redirectToSoliguide"
                icon="arrow-right"
                iconPosition="left"
                >Voir le détail sur soliguide.fr</Button
            >
        </p>
    </PanneauLateral>
</template>

<script setup>
import {
    defineProps,
    toRefs,
    ref,
    computed,
    defineEmits,
    onMounted,
} from "vue";
import { trackEvent } from "@/helpers/matomo";

import { Icon, Link, Button, PanneauLateral } from "@resorptionbidonvilles/ui";

const props = defineProps({
    open: {
        type: Boolean,
        required: false,
        default: false,
    },
    poi: Object,
});
const { open, poi } = toRefs(props);
const panel = ref(null);

const sections = {
    characteristics: computed(() => {
        if (!poi.value) {
            return null;
        }

        const rows = [];
        if (poi.value.name !== undefined) {
            rows.push({
                label: "Nom",
                value: poi.value.name,
            });
        }

        rows.push({
            label: "Adresse",
            value: poi.value.position.adresse || "Inconnue",
        });

        if (poi.value.entity?.phones?.length > 0) {
            rows.push({
                label: "Téléphone(s)",
                value: poi.value.entity.phones
                    .map((phone) => `${phone.phoneNumber}`)
                    .join("\n"),
            });
        }

        if (poi.value.entity?.mail) {
            rows.push({
                label: "Email",
                value: poi.value.entity.mail,
            });
        }

        if (poi.value.languages?.length > 0) {
            rows.push({
                label: "Langue(s) parlée(s)",
                value: poi.value.languages.join(", "),
            });
        }

        if (rows.length === 0) {
            return null;
        }

        return {
            title: "Caractéristiques",
            rows,
        };
    }),
};

const filteredSections = computed(() => {
    return Object.values(sections)
        .map((section) => section.value)
        .filter((section) => section !== null);
});

const emit = defineEmits(["close"]);

function redirectToSoliguide() {
    trackEvent("POI", "Click See More", `P${poi.value.lieu_id}`);
    window.location.assign(`https://soliguide.fr/fiche/${poi.value.lieu_id}`);
}

onMounted(() => {
    if (open.value === true) {
        panel.value.open();
    }
});

defineExpose({
    open() {
        return panel.value.open();
    },
});
</script>
