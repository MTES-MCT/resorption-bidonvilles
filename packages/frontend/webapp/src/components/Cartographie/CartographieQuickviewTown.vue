<template>
    <PanneauLateral ref="panel" @close="emit('close')">
        <template v-slot:header>
            <p>
                <Icon icon="tent" class="mr-2" />
                <Link @click="redirectToDetails"
                    ><span class="font-bold"
                        >{{ town?.addressSimple }}
                        <template v-if="town?.name"
                            >« {{ town?.name }} »</template
                        ></span
                    >
                    <span class="text-sm">({{ town?.city.name }})</span></Link
                >
            </p>
            <p class="text-sm text-G700">
                <template v-if="town?.status === 'open'">
                    Dernière modification le
                    {{ town ? formatDate(town?.updatedAt) : "" }}
                </template>
                <template v-else-if="town"
                    >Site fermé le {{ formatDate(town?.closedAt) }}</template
                >
            </p>
        </template>

        <section v-if="town">
            <p class="text-primary font-bold text-lg">Coordonnées GPS</p>
            <ButtonGPS :town="town" />
        </section>

        <section
            class="mt-6"
            v-for="(section, index) in filteredSections"
            :key="index"
        >
            <h1 class="text-primary font-bold text-lg">{{ section.title }}</h1>
            <div class="grid grid-cols-2 gap-3">
                <p v-for="row in section.rows" :key="row.label">
                    <span class="font-bold" v-if="row.label">
                        {{ row.label }} </span
                    ><br />
                    <span>{{ row.value }}</span>
                </p>
            </div>
        </section>

        <p class="text-sm mt-8 text-center">
            <Button
                type="button"
                @click="redirectToDetails"
                icon="arrow-right"
                iconPosition="left"
                >Voir la fiche du site</Button
            >
        </p>
    </PanneauLateral>
</template>

<script setup>
import { toRefs, ref, computed, onMounted } from "vue";
import formatDate from "@common/utils/formatDate";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";

import { Icon, Link, Button, PanneauLateral } from "@resorptionbidonvilles/ui";
import ButtonGPS from "../ButtonGPS/ButtonGPS.vue";

const props = defineProps({
    open: {
        type: Boolean,
        required: false,
        default: false,
    },
    town: Object,
});
const { open, town } = toRefs(props);
const panel = ref(null);
const emit = defineEmits(["close"]);

const sections = {
    characteristics: computed(() => {
        if (!town.value) {
            return null;
        }

        const rows = [];
        if (town.value.fieldType !== undefined) {
            rows.push({
                label: "Type de site",
                value: town.value.fieldType.label,
            });
        }
        if (town.value.ownerType !== undefined) {
            rows.push({
                label: "Type de propriétaire",
                value: town.value.ownerType.label,
            });
        }
        if (town.value.builtAt !== undefined) {
            rows.push({
                label: "Date d'installation",
                value: town.value.builtAt
                    ? formatDate(town.value.builtAt)
                    : "Inconnue",
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
    population: computed(() => {
        if (!town.value) {
            return null;
        }

        const rows = [];
        if (town.value.populationTotal !== undefined) {
            rows.push({
                label: "Nombre de personnes",
                value:
                    town.value.populationTotal !== null
                        ? town.value.populationTotal
                        : "inconnu",
            });
        }
        if (town.value.populationCouples !== undefined) {
            rows.push({
                label: "Nombre de ménages",
                value:
                    town.value.populationCouples !== null
                        ? town.value.populationCouples
                        : "inconnu",
            });
        }
        if (town.value.populationMinors !== undefined) {
            rows.push({
                label: "Nombre de mineurs",
                value:
                    town.value.populationMinors !== null
                        ? town.value.populationMinors
                        : "inconnu",
            });
        }

        if (town.value.minorsInSchool !== undefined) {
            rows.push({
                label: "Nombre d'enfants inscrits dans un établissement scolaire",
                value:
                    town.value.minorsInSchool !== null
                        ? town.value.minorsInSchool
                        : "inconnu",
            });
        }

        if (town.value.socialOrigins !== undefined) {
            const value = town.value.socialOrigins
                .map((socialOrigin) => {
                    return socialOrigin.label;
                })
                .join(", ");
            rows.push({
                label: "Origines",
                value: town.value.socialOrigins.length > 0 ? value : "inconnu",
            });
        }

        if (rows.length === 0) {
            return null;
        }

        return {
            title: "Habitants",
            rows,
        };
    }),
    justice: computed(() => {
        if (!town.value) {
            return null;
        }

        const rows = [];
        const boolConverter = {
            [true]: "oui",
            [false]: "non",
        };
        if (town.value.justiceProcedure !== undefined) {
            rows.push({
                label: "Existence d'une procédure judiciaire",
                value: boolConverter[town.value.justiceProcedure] || "inconnu",
            });
        }
        if (town.value.justiceRendered !== undefined) {
            rows.push({
                label: "Décision de justice rendue",
                value: boolConverter[town.value.justiceRendered] || "inconnu",
            });
        }
        if (town.value.policeStatus !== undefined) {
            const converter = {
                none: "non demandé",
                requested: "demandé",
                granted: "obtenu",
            };
            rows.push({
                label: "Concours de la force publique demandé",
                value: converter[town.value.policeStatus] || "inconnu",
            });
        }

        if (rows.length === 0) {
            return null;
        }

        return {
            title: "Procédure judiciaire",
            rows,
        };
    }),
};

const filteredSections = computed(() => {
    return Object.values(sections)
        .map((section) => section.value)
        .filter((section) => section !== null);
});

function redirectToDetails() {
    trackEvent("Cartographie", "Redirection page site", `S${town.value.id}`);
    router.push(`/site/${town.value.id}`);
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
