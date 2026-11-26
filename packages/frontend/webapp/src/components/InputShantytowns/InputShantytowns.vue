<template>
    <div>
        <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
        <div class="mb-6 text-G700" v-if="$slots.info">
            <slot name="info" />
        </div>

        <Spinner v-if="townsStore.isLoading"></Spinner>
        <div v-else-if="townsStore.error">
            <Warning :autohide="false"
                >Une erreur est survenue au chargement de la liste des
                sites</Warning
            >
        </div>
        <div v-else>
            <div class="mb-3 flex items-center gap-4">
                <div class="min-w-0 flex-1">
                    <TabList
                        :tabs="tabs"
                        v-model="currentTab"
                        :clickable="false"
                    />
                </div>
                <div class="shrink-0 ml-auto">
                    <slot name="tabs-right" />
                </div>
            </div>
            <TextInput
                :name="`${name}_search`"
                prefixIcon="search"
                placeholder="Adresse, nom d'un site, ville..."
                @keypress="preventSubmit"
            />
            <div class="flex justify-center mt-4 mb-2">
                <DsfrPagination
                    v-if="totalPages > 1"
                    :pages="pages"
                    v-model:current-page="currentPage"
                    :truncLimit="3"
                />
            </div>

            <Tableau :columns="filteredColumns" :data="paginatedCurrentTabData">
                <template v-slot:cell="{ content, column }">
                    <Checkbox
                        v-if="column === 'checkbox'"
                        variant="checkbox"
                        v-model="checked[content]"
                        @change="onCheckChange(content)"
                    />
                    <TypeDeSite
                        :fieldType="content"
                        v-else-if="column === 'fieldType'"
                    />
                    <span
                        v-else-if="column === 'population'"
                        class="block text-right"
                    >
                        <NombreHabitants
                            v-if="content !== null"
                            class="justify-end"
                            :population="content"
                        />
                        <span v-else class="text-G700 italic">N/C</span>
                    </span>
                    <span
                        v-else-if="column === 'closedAt'"
                        class="inline-block italic text-center w-full"
                    >
                        {{ content }}
                    </span>
                    <TableauCellule v-else :content="content" />
                </template>
            </Tableau>
            <div class="flex justify-center mt-6">
                <DsfrPagination
                    v-if="totalPages > 1"
                    :pages="pages"
                    v-model:current-page="currentPage"
                    :truncLimit="3"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, ref, onMounted, computed, nextTick, watch } from "vue";
import { useField, useFieldValue } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import formatDate from "@common/utils/formatDate.js";
import pluralize from "@/utils/pluralize";

import {
    CheckboxUi as Checkbox,
    InputLabel,
    Spinner,
    TabList,
    TextInput,
    Warning,
} from "@resorptionbidonvilles/ui";
import Tableau from "@/components/Tableau/TableauRb.vue";
import TableauCellule from "@/components/Tableau/TableauCellule.vue";
import NombreHabitants from "@/components/NombreHabitants/NombreHabitants.vue";
import TypeDeSite from "@/components/TypeDeSite/TypeDeSite.vue";

const props = defineProps({
    name: String,
    label: String,
    filter: Function,
    columns: {
        type: Array,
        required: false,
        default() {
            return ["city", "address", "fieldType", "population"];
        },
    },
    showMandatoryStar: Boolean,
    defaultTab: {
        type: String,
        required: false,
        default: "open", // soit "open", soit "closed", soit "selected"
    },
});
const { name, label, filter, columns, showMandatoryStar, defaultTab } =
    toRefs(props);

const currentTab = ref(defaultTab.value);
const currentPage = ref(0);
const itemsPerPage = 10;
const search = useFieldValue(`${name.value}_search`);
const { value, handleChange } = useField(name);

const checked = ref(
    (value.value || []).reduce((acc, id) => {
        acc[id] = true;
        return acc;
    }, {})
);

const tabs = computed(() => {
    const totalOpen = data.value.filter(
        ({ status }) => status === "open"
    ).length;
    const totalClosed = data.value.filter(
        ({ status }) => status !== "open"
    ).length;
    return [
        {
            id: "selected",
            label: pluralize(
                value.value?.length || 0,
                "Site sélectionné",
                "Sites sélectionnés"
            ),
            total: value.value ? value.value.length : 0,
        },
        {
            id: "open",
            label: pluralize(totalOpen, "Site ouvert", "Sites ouverts"),
            total: totalOpen,
        },
        {
            id: "closed",
            label: pluralize(totalClosed, "Site fermé", "Sites fermés"),
            total: totalClosed,
        },
    ];
});

const COLUMNS_DEFINITION = [
    { id: "city", label: "Commune" },
    { id: "address", label: "Adresse" },
    { id: "fieldType", label: "Type de site" },
    { id: "population", label: "Nombre de personnes" },
    { id: "closedAt", label: "Statut du site" },
];
const filteredColumns = computed(() => {
    return [
        { id: "checkbox", label: "" },
        ...COLUMNS_DEFINITION.filter(({ id }) => columns.value.includes(id)),
    ];
});

const data = computed(() => {
    if (townsStore.towns.length === 0) {
        return [];
    }

    if (!filter.value) {
        return townsStore.towns;
    }

    return townsStore.towns.filter(filter.value);
});

function toTimestamp(value) {
    if (!value) {
        return 0;
    }

    if (typeof value === "number") {
        return value;
    }

    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) {
        return asNumber;
    }

    const asDate = new Date(value).getTime() / 1000;
    return Number.isNaN(asDate) ? 0 : asDate;
}

const currentTabData = computed(() => {
    const reg = new RegExp(search.value, "i");
    const filteredData = data.value
        .filter(({ id, status, city, usename }) => {
            if (currentTab.value === "open") {
                if (status !== "open") {
                    return false;
                }
            } else if (currentTab.value === "closed") {
                if (status === "open") {
                    return false;
                }
            } else {
                // currentTab === "selected" here
                if (
                    !value.value?.includes ||
                    !(value.value.includes(id) || value.value.includes(`${id}`))
                ) {
                    return false;
                }
            }

            // filter by search
            return search.value === "" || `${city.name} ${usename}`.match(reg);
        })
        .sort((a, b) => {
            if (currentTab.value === "open") {
                const dateA = toTimestamp(a.builtAt || a.declaredAt);
                const dateB = toTimestamp(b.builtAt || b.declaredAt);
                return dateB - dateA;
            }

            if (currentTab.value === "closed") {
                const dateA = toTimestamp(a.closedAt);
                const dateB = toTimestamp(b.closedAt);
                return dateB - dateA;
            }

            return 0;
        });

    return filteredData.map(
        ({ id, city, usename, fieldType, populationTotal, closedAt }) => {
            return {
                id,
                checkbox: id,
                city: city.name,
                address: usename,
                fieldType,
                population: populationTotal,
                closedAt: closedAt
                    ? `Fermé le ${formatDate(closedAt, "d/m/y")}`
                    : "Ouvert",
            };
        }
    );
});

const totalPages = computed(() => {
    return Math.ceil(currentTabData.value.length / itemsPerPage);
});

const pages = computed(() => {
    const results = [];
    for (let i = 1; i <= totalPages.value; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }

    return results;
});

const paginatedCurrentTabData = computed(() => {
    const start = currentPage.value * itemsPerPage;
    return currentTabData.value.slice(start, start + itemsPerPage);
});

function onCheckChange() {
    nextTick(() => {
        handleChange(
            Object.keys(checked.value).filter(
                (id) => checked.value[id] === true
            )
        );
    });
}

function preventSubmit(event) {
    const key = event.charCode || event.keyCode;
    if (key === 13) {
        event.preventDefault();
    }
}

const townsStore = useTownsStore();

watch([currentTab, search, data], () => {
    currentPage.value = 0;
});

watch(totalPages, (value) => {
    if (value === 0) {
        currentPage.value = 0;
        return;
    }

    if (currentPage.value > value - 1) {
        currentPage.value = value - 1;
    }
});

onMounted(() => {
    if (townsStore.towns.length === 0) {
        townsStore.fetchTowns();
    }
});
</script>
