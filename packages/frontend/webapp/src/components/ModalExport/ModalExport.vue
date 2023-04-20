<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>Exports</template>
        <template v-slot:body>
            <p>
                Plusieurs exports sont disponibles, cliquez sur celui ou ceux
                qui vous intéressent pour les télécharger :
            </p>
            <ul class="list-disc mt-3 ml-4">
                <li v-for="exportItem in exportList" :key="exportItem.filename">
                    <ModalExportLien
                        :label="exportItem.label"
                        :filename="exportItem.filename"
                        :downloadFn="exportItem.downloadFn"
                    />
                </li>
            </ul>
        </template>

        <template v-slot:footer>
            <Button @click="close">Fermer</Button>
        </template>
    </Modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { Button, Modal } from "@resorptionbidonvilles/ui";
import ModalExportLien from "./ModalExportLien.vue";

const props = defineProps({
    exports: Array,
});
const { exports: exportList } = toRefs(props);

const isOpen = ref(false);
function close() {
    isOpen.value = false;
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
