<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>
            {{ title }}
        </template>

        <template v-slot:body>
            <CarteAutorisationAccesAuxPJ
                :usersWithPermissionOnJustice="permissionsToAccessJustice"
                class="max-w-2xl"
            />
        </template>
        <template v-slot:footer>
            <Button class="ml-5" :loading="loading" @click="isOpen = false"
                >J'ai compris</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { ref, defineExpose, toRefs } from "vue";
import { Button, Modal } from "@resorptionbidonvilles/ui";
import CarteAutorisationAccesAuxPJ from "@/components/CarteAutorisationAccesAuxPJ/CarteAutorisationAccesAuxPJ.vue";

const props = defineProps({
    permissionsToAccessJustice: {
        type: Array,
        default: () => {},
    },
    title: {
        type: String,
        required: true,
    },
});

const { permissionsToAccessJustice, title } = toRefs(props);

const isOpen = ref(false);
const error = ref(null);

function reset() {
    error.value = null;
}

function close() {
    isOpen.value = false;
    reset();
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
