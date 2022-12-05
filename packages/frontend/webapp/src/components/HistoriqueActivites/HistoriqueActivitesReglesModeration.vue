<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>Règles de modération d'un message</template>
        <template v-slot:body>
            <p class="font-bold">
                En tant qu'administrateur, vous êtes en charge de la modération
                des messages.
            </p>

            <p class="mt-4">
                Vous pouvez supprimer un message ou demander à son auteur de le
                modifier s'il ne respecte pas les règles suivantes :<br />
                - être neutre et factuel ;<br />
                - ne pas collecter des données personnelles (nom, condamnation
                judiciaire...) de personnes ou groupes, porter une attention
                particulière aux personnes habitant ou issues d'un bidonville
                ;<br />
                - ne doit pas être subjectif, insultant ou inapproprié.
            </p>

            <p class="mt-4">
                Pour plus d'informations :<br />
                <Link withStyle @click="openGuide"
                    ><Icon icon="file-pdf" /> Guide des accès et de
                    l'administrateur</Link
                ><br />
                <Link :to="configStore.config.version_charte_engagement.fichier"
                    ><Icon icon="file-pdf" /> Charte d'engagement de
                    l'utilisateur</Link
                >
            </p>
        </template>
    </Modal>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { Icon, Link, Modal } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const isOpen = ref(false);

function close() {
    isOpen.value = false;
}

function openGuide(event) {
    event.stopPropagation();
    window.location = "/doc/guide_de_l_administrateur.pdf";
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
