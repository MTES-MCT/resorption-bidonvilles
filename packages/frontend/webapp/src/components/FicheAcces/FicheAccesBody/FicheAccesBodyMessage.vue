<template>
    <FicheAccesBodySection>
        <template v-slot:title>Message de demande</template>
        {{
            user.access_request_message ||
            "N/A — Cet utilisateur a été créé par un administrateur"
        }}
    </FicheAccesBodySection>
</template>

<script setup>
import { toRefs } from "vue";
import FicheAccesBodySection from "./FicheAccesBodySection.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);
</script>
