<template>
    <div class="relative mb-4 m-auto" :class="width">
        <DsfrNotice
            v-if="!isClosed"
            :type="type"
            :title="title"
            :closeable="closeable"
            @close="closeNotice"
        >
            <template v-slot:desc>
                <p class="mt-2 -mb-4">
                    {{ description }}
                </p>
            </template>
        </DsfrNotice>
    </div>
</template>
<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) =>
            [
                "info",
                "warning",
                "alert",
                "weather-orange",
                "weather-red",
                "weather-purple",
                "witness",
                "kidnapping",
                "attack",
                "cyberattack",
            ].includes(value),
        default: "info",
    },
    title: {
        type: String,
        required: true,
        default: "",
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    closeable: {
        type: Boolean,
        required: false,
        default: false,
    },
    width: {
        type: String,
        required: false,
        default: "w-full",
    },
    enabled: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { type, title, description, closeable, enabled } = toRefs(props);

const isClosed = computed(() => {
    return !enabled.value || false;
});
const closeNotice = () => {
    isClosed.value = true;
};
</script>
