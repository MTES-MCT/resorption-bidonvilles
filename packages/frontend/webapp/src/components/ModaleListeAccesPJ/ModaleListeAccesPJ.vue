<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title> {{ title }} </template>
        <template v-slot:body>
            <CarteAutorisationAccesAuxPJ
                v-if="!error"
                :permissionsToAccessJustice="permissionsToAccessJustice"
                :loading="loading"
                class="max-w-2xl"
            />
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>
        <template v-slot:footer>
            <Button type="button" class="ml-5" @click="isOpen = false"
                >J'ai compris</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { computed, defineExpose, onMounted, ref, toRefs, watch } from "vue";
import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import CarteAutorisationAccesAuxPJ from "@/components/CarteAutorisationAccesAuxPJ/CarteAutorisationAccesAuxPJ.vue";
import { getJusticeReaders } from "@/api/towns.api";
import getReducedLoadedPermissionsToAccessJustice from "@common/helpers/permission/getReducedLoadedPermissionsToAccessJustice";

const props = defineProps({
    townId: Number,
    title: String,
});
const { townId, title } = toRefs(props);
const loadedPermissionsToAccessJustice = ref(null);

const loading = ref(false);
const error = ref(null);

onMounted(load);

async function load() {
    await loadPermissionsToAccessJustice();
}

async function loadPermissionsToAccessJustice() {
    loading.value = true;
    error.value = null;
    try {
        loadedPermissionsToAccessJustice.value = await getJusticeReaders(
            townId.value
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }
    loading.value = false;
}

const permissionsToAccessJustice = computed(() => {
    let usersWithPermissionsToAccessJustice = [];
    if (loadedPermissionsToAccessJustice.value) {
        usersWithPermissionsToAccessJustice =
            getReducedLoadedPermissionsToAccessJustice(
                loadedPermissionsToAccessJustice.value
            );
    }
    return Object.values(usersWithPermissionsToAccessJustice);
});

watch(townId, async () => {
    if (townId.value?.type) {
        try {
            await load();
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
        }
    }
});

const isOpen = ref(false);

function reset() {
    loading.value = false;
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
