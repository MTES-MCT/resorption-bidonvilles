<template>
    <section class="border-r pr-8 w-[28rem] break-words overflow-hidden">
        <FicheAccesColumnUserDetails :user="user" />
        <FicheAccesColumnAccessDetails
            :user="user"
            class="border-t border-G200 mt-5 pt-5"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheAccesColumnUserDetails from "./FicheAccesColumnUserDetails.vue";
import FicheAccesColumnAccessDetails from "./FicheAccesColumnAccessDetails.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);
</script>
