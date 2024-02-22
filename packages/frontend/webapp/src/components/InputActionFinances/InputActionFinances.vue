<template>
    <div>
        <InputLabel :label="label" :showMandatoryStar="showMandatoryStar" />
        <div class="mb-6 text-G700" v-if="$slots.info">
            <slot name="info" />
        </div>

        <div class="flex justify-between items-center">
            <Button
                icon="arrow-left"
                iconPosition="left"
                type="button"
                variant="textPrimary"
                :disabled="focusedYear <= minYear"
                @click="previousYear"
                >Année précédente</Button
            >
            <p class="text-lg text-primary font-bold text-center">
                Année {{ focusedYear }}
            </p>
            <Button
                icon="arrow-right"
                iconPosition="right"
                type="button"
                variant="textPrimary"
                :disabled="focusedYear >= maxYear"
                @click="nextYear"
                >Année suivante</Button
            >
        </div>

        <Tableau :columns="COLUMNS_DEFINITION" :data="focusedYearData">
            <template v-slot:empty
                >Aucun financement renseigné pour cette année</template
            >
            <template v-slot:cell="{ column, row }">
                <SelectUi
                    v-if="column === 'finance_type'"
                    v-model="value[focusedYear][row].finance_type"
                    withoutMargin
                >
                    <option
                        v-for="option in financeTypes"
                        :key="option.uid"
                        :value="option.uid"
                    >
                        {{ option.name }}
                    </option>
                </SelectUi>
                <TextInputUi
                    v-if="column === 'comments'"
                    v-model="value[focusedYear][row].comments"
                    withoutMargin
                />
                <TextInputUi
                    v-else-if="column === 'amount'"
                    v-model="value[focusedYear][row].amount"
                    withoutMargin
                />
                <TextInputUi
                    v-else-if="column === 'real_amount'"
                    v-model="value[focusedYear][row].real_amount"
                    withoutMargin
                />
                <Button
                    v-else-if="column === 'actions'"
                    type="button"
                    icon="trash-alt"
                    size="sm"
                    variant="primary"
                    @click="removeRow(row)"
                />
            </template>
        </Tableau>

        <p class="mt-1">
            <template v-if="yearsWithData.length > 0">
                Années avec financements renseignés :
                <Link
                    class="mr-1"
                    v-for="year in yearsWithData"
                    :key="year"
                    withStyle
                    @click="($event) => setYear(parseInt(year, 10))"
                    >{{ year }}</Link
                >
            </template>
            <template v-else
                >Il n'existe pas encore d'année avec une ligne de financement
                renseignée.</template
            >
        </p>

        <p class="mt-2 text-right">
            <Button type="button" @click="addRow"
                >Ajouter une ligne de financement</Button
            >
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref, computed, watch } from "vue";
import { useField } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";

import Tableau from "@/components/Tableau/TableauRb.vue";
import {
    Button,
    InputLabel,
    Link,
    SelectUi,
    TextInputUi,
} from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: String,
    label: String,
    minYear: {
        type: Number,
        required: false,
    },
    maxYear: {
        type: Number,
        required: false,
        default() {
            return new Date().getFullYear();
        },
    },
});
const { name, label, minYear, maxYear } = toRefs(props);

const { value } = useField(name);
const configStore = useConfigStore();

const COLUMNS_DEFINITION = [
    { id: "finance_type", label: "Type de financement" },
    { id: "comments", label: "Description" },
    { id: "amount", label: "Montant du financement" },
    { id: "real_amount", label: "Dépense exécutée" },
    { id: "actions", label: "" },
];

let maxId = !value.value
    ? 0
    : Math.max(
          Object.values(value.value)
              .map(({ id }) => id)
              .flat()
      );

const focusedYear = ref(new Date().getFullYear());
const focusedYearData = computed(() => {
    return value.value?.[focusedYear.value] || [];
});
const yearsWithData = computed(() => {
    if (!value.value) {
        return [];
    }

    return Object.keys(value.value).filter(
        (year) => value.value[year]?.length > 0
    );
});
const financeTypes = computed(() => {
    const types = [...configStore.config.action_finance_types];
    types.sort((a, b) => {
        if (a.name === "Autre") {
            return 1;
        } else if (b.name === "Autre") {
            return -1;
        }

        return a.name < b.name ? -1 : 1;
    });

    return types;
});

function setYear(year) {
    focusedYear.value = year;
}

function previousYear() {
    setYear(Math.max(minYear.value || 0, focusedYear.value - 1));
}

function nextYear() {
    setYear(Math.min(maxYear.value, focusedYear.value + 1));
}

function addRow() {
    if (!value.value) {
        value.value = {};
    }

    if (!value.value[focusedYear.value]) {
        value.value[focusedYear.value] = [];
    }

    value.value[focusedYear.value].push({
        id: getNextId(),
        finance_type: undefined,
        comments: "",
        amount: 0.0,
        real_amount: 0.0,
    });
}

function removeRow(index) {
    focusedYearData.value.splice(index, 1);
}

watch(minYear, applyNewTimeRange);
watch(maxYear, applyNewTimeRange);

function applyNewTimeRange() {
    if (!value.value) {
        return;
    }

    Object.keys(value.value).forEach((strYear) => {
        const year = parseInt(strYear, 10);
        if (year < minYear.value || year > maxYear.value) {
            delete value.value[strYear];
            value.value[strYear] = undefined;
        }
    });

    if (minYear.value && focusedYear.value < minYear.value) {
        focusedYear.value = minYear.value;
    }
    if (maxYear.value && focusedYear.value > maxYear.value) {
        focusedYear.value = maxYear.value;
    }
}

function getNextId() {
    maxId++;
    return maxId;
}
</script>
