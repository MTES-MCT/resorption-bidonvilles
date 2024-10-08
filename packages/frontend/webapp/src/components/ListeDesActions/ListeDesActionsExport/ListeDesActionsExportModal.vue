<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title>{{ title }}</template>
        <template v-slot:body>
            <template v-if="!actionsExportIsSelected">
                <template v-if="exportList.length > 0">
                    <p>
                        Plusieurs exports sont disponibles, cliquez sur celui
                        qui vous intéresse pour le télécharger:
                    </p>
                    <ul class="list-disc mt-3 ml-4">
                        <li>
                            <Link @click.stop="toggleActionsExportIsSelected">
                                <Icon icon="file-excel" class="mr-1" />
                                Exporter les actions
                            </Link>
                        </li>
                        <li
                            v-for="exportItem in linksForBody"
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
                <template v-else>
                    <p>Aucun export n'est disponible</p>
                </template>
            </template>
            <template v-else>
                <ModalExportListeAnnee
                    :years="years"
                    @year-selected="handleYearSelected"
                />
            </template>
        </template>
        <template v-slot:footer>
            <div>
                <ul
                    class="flex flex-col items-start gap-2 xs:flex-row xs:justify-start"
                >
                    <li
                        v-for="exportItem in linksForFooter"
                        :key="exportItem.filename"
                    >
                        <ModalExportLien
                            v-if="displayExportActionsBtn(exportItem.filename)"
                            :shape="exportItem.shape"
                            :label="exportItem.label"
                            :filename="exportItem.filename"
                            :downloadFn="exportItem.downloadFn"
                            :format="exportItem.format"
                            :disabled="!selectedYear"
                            :year="selectedYear"
                        />
                    </li>
                    <li>
                        <Button
                            v-if="actionsExportIsSelected"
                            variant="primaryOutline"
                            size="md"
                            @click.stop="toggleActionsExportIsSelected"
                        >
                            Annuler</Button
                        >
                    </li>
                    <li>
                        <Button @click="() => modale.close()">Fermer</Button>
                    </li>
                </ul>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { ref, computed, defineProps, toRefs } from "vue";
import { Button, Icon, Link, Modal } from "@resorptionbidonvilles/ui";
import ModalExportLien from "@/components/ModalExport/ModalExportLien.vue";
import ModalExportListeAnnee from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportListeAnnees.vue";

const props = defineProps({
    exports: Array,
});
const { exports: exportList } = toRefs(props);
const modale = ref(null);
const actionsExportIsSelected = ref(false);
const selectedYear = ref(null);

const years = computed(() => {
    return exportList.value
        .filter((exportItem) => exportItem.filename === "actions")
        .map((exportItem) => exportItem.years)[0];
});

function toggleActionsExportIsSelected() {
    actionsExportIsSelected.value = !actionsExportIsSelected.value;
}

function handleYearSelected(year) {
    selectedYear.value = year;
}

const linksForBody = computed(() => {
    return exportList.value.filter(
        (exportItem) => exportItem.displayedOn === "body"
    );
});

const linksForFooter = computed(() => {
    return exportList.value.filter(
        (exportItem) => exportItem.displayedOn === "footer"
    );
});

function displayExportActionsBtn(label) {
    const returnValue =
        label === "actions" && actionsExportIsSelected.value === true;
    console.log("label", label);
    console.log("actionsExportIsSelected", actionsExportIsSelected.value);
    console.log("returnValue", returnValue);
    return returnValue;
}

const title = computed(() => {
    return actionsExportIsSelected.value ? "Export des actions" : "Exports";
});
</script>
