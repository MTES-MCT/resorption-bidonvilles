<template>
    <Modal>
        <template v-slot:title
            >Confirmez-vous la suppression de ce message ?</template
        >
        <template v-slot:body>
            <CarteCommentaire
                :comment="answer"
                class="bg-G100 p-6 border-1 max-w-2xl"
            />
        </template>
    </Modal>
</template>

<script setup>
import { Modal } from "@resorptionbidonvilles/ui";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import { toRefs } from "vue";

const props = defineProps({
    answer: {
        type: Object,
        required: true,
    },
});
const { answer } = toRefs(props);
</script>
