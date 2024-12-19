<template>
    <TextInput
        name="people_affected"
        id="people_affected"
        info="Incitez les autres membres de la communauté à vous répondre rapidement en indiquant le nombre de personnes qui ont besoin d'aide"
        width="w-28"
        :value="peopleAffected"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    peopleAffected: {
        type: String,
        required: false,
        default: "",
    },
});
const { peopleAffected } = toRefs(props);
</script>
