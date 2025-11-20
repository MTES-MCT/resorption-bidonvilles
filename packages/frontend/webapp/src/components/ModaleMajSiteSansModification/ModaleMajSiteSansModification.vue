<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title>Mise à jour sans modification</template>
        <template v-slot:body>
            <div class="fr-text">
                <p class="fr-mb-3w">
                    Vous vous apprêtez à enregistrer une mise à jour du site
                    sans avoir modifié aucune donnée.
                </p>
                <p class="fr-mb-3w">
                    Cette action mettra à jour la date de dernière modification
                    du site dans la base de données, mais les informations du
                    site resteront identiques.
                </p>
                <p class="fr-text--bold">
                    Voulez-vous confirmer cette mise à jour ?
                </p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end gap-2">
                <DsfrButton secondary @click="() => modale.close()"
                    >Annuler</DsfrButton
                >
                <DsfrButton @click="confirmUpdate" variant="primary"
                    >Confirmer la mise à jour</DsfrButton
                >
            </div>
        </template>
    </Modal>
</template>
<script setup>
import { toRefs, ref } from "vue";
import { Modal } from "@resorptionbidonvilles/ui";

const props = defineProps({
    onConfirm: {
        type: Function,
        required: true,
    },
});

const { onConfirm } = toRefs(props);
const modale = ref(null);

const confirmUpdate = async () => {
    try {
        await onConfirm.value();
        modale.value.close();
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
    }
};
</script>
