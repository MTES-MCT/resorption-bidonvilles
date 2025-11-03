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
            <TabList
                :tabs="tabs"
                v-model="currentTab"
                class="mb-3"
                :clickable="false"
            />
            <TextInput
                :name="`${name}_search`"
                prefixIcon="search"
                placeholder="Adresse, nom d'un site, ville..."
                @keypress="preventSubmit"
            />

            <Tableau :columns="filteredColumns" :data="currentTabData">
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
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref, onMounted, computed, nextTick } from "vue";
import { useField, useFieldValue } from "vee-validate";
import { useTownsStore } from "@/stores/towns.store";
import formatDate from "@common/utils/formatDate.js";

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
const search = useFieldValue(`${name.value}_search`);
const { value, handleChange } = useField(name);

const checked = ref(
    (value.value || []).reduce((acc, id) => {
        acc[id] = true;
        return acc;
    }, {})
);

const pluralize = (count, singular, plural) => (count > 1 ? plural : singular);

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

const currentTabData = computed(() => {
    const reg = new RegExp(search.value, "i");
    return data.value
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
        .map(({ id, city, usename, fieldType, populationTotal, closedAt }) => {
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
        });
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

onMounted(() => {
    if (townsStore.towns.length === 0) {
        townsStore.fetchTowns();
    }
});
</script>
