<template>
    <div class="ml-7">
        <div class="text-G600">
            {{ organization.name }}
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
    organization: {
        type: Object,
        required: true,
    },
});
const { organization } = toRefs(props);
</script>
