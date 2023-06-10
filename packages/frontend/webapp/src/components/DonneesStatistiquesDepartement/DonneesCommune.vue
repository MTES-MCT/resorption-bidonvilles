<template>
    <tr class="text-right data-table-header">
        <th class="text-left font-normal">
            <span class="font-bold">{{ data.city.name }}</span
            ><br /><span class="text-sm">{{ data.city.code }}</span>
            <!-- @todo: afficher le code postal ? -->
        </th>
        <th class="font-normal">{{ summary.number_of_towns }}<br />&nbsp;</th>
        <th class="font-normal">{{ summary.number_of_persons }}<br />&nbsp;</th>
        <th class="font-normal">
            {{ summary.number_of_towns_with_water }}<br /><span class="text-sm"
                >({{ summary.percentage_of_towns_with_water }} %)</span
            >
        </th>
    </tr>
    <tr class="bg-G100 text-right" v-for="town in data.towns" :key="town.id">
        <td class="text-left">
            {{ town.usename }}<br /><span class="text-sm">{{
                town.field_type
            }}</span>
        </td>
        <td></td>
        <td>{{ town.number_of_persons }}<br />&nbsp;</td>
        <td
            class="text-lg"
            :class="town.access_to_water ? 'text-success' : 'text-error'"
        >
            <Icon
                :icon="town.access_to_water ? 'check' : 'times'"
            /><br />&nbsp;
        </td>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const { data } = toRefs(props);

const summary = computed(() => {
    const s = {
        number_of_towns: data.value.towns.length,
        number_of_persons: 0,
        number_of_towns_with_water: 0,
        percentage_of_towns_with_water: 0.0,
    };

    return data.value.towns.reduce((acc, town) => {
        s.number_of_persons += town.number_of_persons;
        s.number_of_towns_with_water += town.access_to_water ? 1 : 0;
        s.percentage_of_towns_with_water =
            Math.round(
                (s.number_of_towns_with_water / s.number_of_towns) * 1000
            ) / 10;

        return acc;
    }, s);
});
</script>
