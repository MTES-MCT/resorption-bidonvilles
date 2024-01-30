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
            </template>

            <template v-if="itemsWithDateRange.length > 0">
                <p :class="itemsWithoutDateRange.length > 0 ? 'mt-4' : ''">
                    Pour les exports suivants, veuillez sélectionner une période
                    avant de télécharger le fichier :
                </p>
                <p class="my-2 flex items-center space-x-3">
                    <span>Du</span>
                    <DatepickerInput withoutMargin name="from" />
                    <span>au</span>
                    <DatepickerInput withoutMargin name="to" />
                </p>
                <ul class="list-disc mt-3 ml-4">
                    <li
                        v-for="exportItem in itemsWithDateRange"
                        :key="exportItem.filename"
                    >
                        <ModalExportLien
                            :label="exportItem.label"
                            :filename="exportItem.filename"
                            :downloadFn="() => exportItem.downloadFn(from, to)"
                            :format="exportItem.format"
                        />
                    </li>
                </ul>
            </template>
        </template>

        <template v-slot:footer>
            <Button @click="() => modale.close()">Fermer</Button>
        </template>
    </Modal>
</template>

<script setup>
import { toRef, ref, computed, defineProps, toRefs } from "vue";
import { useForm } from "vee-validate";
import { Button, DatepickerInput, Modal } from "@resorptionbidonvilles/ui";
import ModalExportLien from "./ModalExportLien.vue";

const props = defineProps({
    exports: Array,
});
const { exports: exportList } = toRefs(props);
const modale = ref(null);

const d = new Date();
d.setDate(d.getDate() - 7);
const { values } = useForm({
    initialValues: {
        from: d,
        to: new Date(),
    },
});
const from = toRef(values, "from");
const to = toRef(values, "to");

const itemsWithoutDateRange = computed(() => {
    return exportList.value.filter((item) => !item.withDateRange);
});

const itemsWithDateRange = computed(() => {
    return exportList.value.filter((item) => item.withDateRange);
});
</script>
