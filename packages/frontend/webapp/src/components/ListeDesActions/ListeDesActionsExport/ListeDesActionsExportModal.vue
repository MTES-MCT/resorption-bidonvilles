<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title>Exports</template>
        <template v-slot:body>
            <p>
                Plusieurs exports sont disponibles, cliquez sur celui ou ceux
                qui vous intéressent pour les télécharger :
            </p>

            <template v-if="itemsWithoutDateRange.length > 0">
                <ul class="list-disc mt-3 ml-4">
                    <li
                        v-for="exportItem in itemsWithoutDateRange"
                        :key="exportItem.filename"
                    >
                        <ModalExportLien
                            :label="exportItem.label"
                            :filename="exportItem.filename"
                            :downloadFn="exportItem.downloadFn"
                            :format="exportItem.format"
                        />
                    </li>
                </ul>
                <ModalExportListeAnnee :years="years" />
            </template>
        </template>

        <template v-slot:footer>
            <Button @click="() => modale.close()">Fermer</Button>
        </template>
    </Modal>
</template>

<script setup>
import { ref, computed, defineProps, toRefs } from "vue";
import { Button, Modal } from "@resorptionbidonvilles/ui";
import ModalExportLien from "@/components/ModalExport/ModalExportLien.vue";

const props = defineProps({
    exports: Array,
});
const { exports: exportList } = toRefs(props);
const modale = ref(null);

const itemsWithoutDateRange = computed(() => {
    return exportList.value.filter((item) => !item.withDateRange);
});

const years = computed(() => {
    return exportList.value[0].year;
});
</script>
