<template>
    <div class="bg-yellow-200 flex flex-row p-5">
        <Checkbox :value="true" :name="name" variant="checkbox">
            <slot />
        </Checkbox>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Checkbox } from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: String,
});
const { name } = toRefs(props);
</script>
