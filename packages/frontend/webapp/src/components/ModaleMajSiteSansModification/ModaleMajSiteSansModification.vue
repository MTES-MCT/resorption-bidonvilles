<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
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
            <Button variant="secondary" @click="cancelUpdate" class="fr-mr-2w">
                Annuler
            </Button>
            <Button variant="primary" @click="confirmUpdate">
                Confirmer la mise à jour
            </Button>
        </template>
    </Modal>
</template>
<script setup>
import { toRefs, ref } from "vue";
import { Button, Modal } from "@resorptionbidonvilles/ui";

const props = defineProps({
    onConfirm: {
        type: Function,
        required: true,
    },
});

const { onConfirm } = toRefs(props);
const modale = ref(null);

const onClose = () => {
    modale.value.close();
};

const cancelUpdate = () => {
    onClose();
};

const confirmUpdate = async () => {
    try {
        await onConfirm.value();
        onClose();
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
    }
};
</script>
