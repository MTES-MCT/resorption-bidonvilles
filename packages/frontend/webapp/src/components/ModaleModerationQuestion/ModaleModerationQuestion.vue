<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>
            Êtes-vous sûr de vouloir supprimer cette question ?
        </template>

        <template v-slot:body>
            {{ wording }}
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="close">Annuler</Button>
            <Button class="ml-5" :loading="loading" @click="remove"
                >Supprimer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";

const props = defineProps({
    answersCount: {
        type: Number,
    },
    author: {
        type: Object,
    },
});

const { answersCount, author } = toRefs(props);
const loading = ref(false);
const error = ref(null);
const isOpen = ref(false);

const wording = computed(() => {
    const baseWording = `Confirmez-vous la suppression de la question de
            ${author.value.first_name} ${author.value.last_name}`;
    return answersCount.value === 0
        ? `${baseWording} ?`
        : `${baseWording} ainsi que les ${answersCount.value} réponse(s) associée(s)?`;
});

function reset() {
    loading.value = false;
    error.value = null;
}

function close() {
    isOpen.value = false;
    reset();
}

async function remove() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;
    return true;
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
