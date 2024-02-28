<template>
    <div class="mt-6 bg-yellow-200 py-6 px-8">
        <Icon icon="triangle-exclamation" /> N'envoyez
        <span class="font-bold underline">jamais</span> un accès si vous avez un
        doute sur l'identité de la personne pour éviter tout risque d'usurpation
        d'identité.
        <Link
            withStyle
            @click="openGuide('/doc/guide_de_l_administrateur.pdf')"
        >
            <Icon icon="file-pdf" /> Consulter le guide des accès et de
            l'administrateur
        </Link>
    </div>
</template>

<script setup>
import { Icon, Link } from "@resorptionbidonvilles/ui";

function openGuide(link) {
    window.location = link;
}
</script>
