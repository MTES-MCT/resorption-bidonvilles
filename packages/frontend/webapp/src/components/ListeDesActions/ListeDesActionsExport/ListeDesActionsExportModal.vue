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
                                Choisir l'année et exporter les actions
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
                                @export-error="onExportError"
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
                    :selectedYear="selectedYear"
                    @year-selected="handleYearSelected"
                />
            </template>
            <div v-if="error">
                <DsfrAlert type="error" :description="error" small />
            </div>
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
                            @export-error="onExportError"
                        />
                    </li>
                    <li>
                        <DsfrButton
                            v-if="actionsExportIsSelected"
                            secondary
                            size="md"
                            @click.stop="toggleActionsExportIsSelected"
                        >
                            Annuler</DsfrButton
                        >
                    </li>
                    <li>
                        <DsfrButton @click="() => modale.close()"
                            >Fermer</DsfrButton
                        >
                    </li>
                </ul>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { ref, computed, toRefs, watch } from "vue";
import { Icon, Link, Modal } from "@resorptionbidonvilles/ui";
import ModalExportLien from "@/components/ModalExport/ModalExportLien.vue";
import ModalExportListeAnnee from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportListeAnnees.vue";

const props = defineProps({
    exports: Array,
});
const { exports: exportList } = toRefs(props);
const modale = ref(null);
const actionsExportIsSelected = ref(false);
const error = ref(null);

const selectedYear = ref(new Date().getFullYear() - 1);

const years = computed(() => {
    const actionExport = exportList.value.find(
        (exportItem) => exportItem.filename === "actions"
    );

    if (!actionExport || !actionExport.years) {
        return [];
    }

    // Si years est une ref, accéder à sa valeur
    const yearsValue = actionExport.years._object
        ? actionExport.years._object.years
        : actionExport.years;

    return yearsValue || [];
});

// Calculer l'année par défaut : année en cours - 1, ou la première année disponible la plus proche
const defaultYear = computed(() => {
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 1;
    const availableYears = years.value || [];

    if (availableYears.length === 0) {
        return targetYear;
    }

    // Si l'année cible existe dans la liste, l'utiliser
    const availableYearsSet = new Set(availableYears);
    if (availableYearsSet.has(targetYear)) {
        return targetYear;
    }

    // Sinon, trouver l'année disponible la plus proche et antérieure à l'année en cours
    const pastYears = availableYears.filter((year) => year < currentYear);
    if (pastYears.length > 0) {
        // Retourner l'année la plus récente parmi les années passées
        return Math.max(...pastYears);
    }

    // Si aucune année passée n'est disponible, retourner la première année disponible
    return Math.min(...availableYears);
});

// Mettre à jour selectedYear quand defaultYear change (quand les années sont chargées)
watch(
    defaultYear,
    (newDefaultYear) => {
        selectedYear.value = newDefaultYear;
    },
    { immediate: true }
);

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
    return returnValue;
}

const title = computed(() => {
    return actionsExportIsSelected.value ? "Export des actions" : "Exports";
});

const onExportError = (message) => {
    if (!message) {
        error.value = null;
        return;
    }
    error.value = message;
};
</script>
