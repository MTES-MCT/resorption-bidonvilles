<template>
    <div class="bg-yellow-200 flex flex-row p-5 items-center">
        <div>
            <Checkbox
                class="px-5"
                :value="true"
                :name="name"
                variant="checkbox"
            >
            </Checkbox>
        </div>
        <div>
            <slot />
        </div>
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
