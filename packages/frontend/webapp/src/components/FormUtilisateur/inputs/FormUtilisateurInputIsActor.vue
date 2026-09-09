<template>
    <CheckableGroup id="is_actor" :label="label" direction="row" :info="info">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="is_actor"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import { toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);

const info =
    'Si ce n\'est pas le cas, écrivez-nous dans le champ "Votre message"';
const items = [
    { value: true, label: "Oui" },
    { value: false, label: "Non" },
];
</script>
