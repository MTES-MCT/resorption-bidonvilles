<template>
    <FilArianne />
    <Title class="mt-6">{{ city.name }} ({{ city.departement.code }})</Title>
    <Header class="mt-4" />

    <section class="mt-6 bg-G100 border border-G300 rounded py-4 px-6">
        <header class="text-lg font-bold">Au 11 Mai 2023</header>
        <div class="flex items-stretch">
            <div class="flex space-x-5 self-center flex-1">
                <p><span class="font-bold text-xl">775</span><br />sites</p>
                <p>
                    <span class="font-bold text-xl">2300</span><br />personnes
                </p>
            </div>
            <div class="w-px bg-G300 mx-6"></div>
            <div>
                <p>Sites avec exclusivement des ressortissants européens</p>
                <div class="flex space-x-5">
                    <p><span class="font-bold text-lg">112</span><br />sites</p>
                    <p>
                        <span class="font-bold text-lg">1200</span
                        ><br />personnes
                    </p>
                </div>
            </div>
            <div class="w-px bg-G300 mx-6"></div>
            <div>
                <div class="text-error flex space-x-2">
                    <p><Icon icon="face-frown" /></p>
                    <p>
                        12 sites sans nombre de personnes ou indications de
                        l'origine
                    </p>
                </div>
                <div class="text-success flex space-x-2">
                    <p><Icon icon="face-smile" /></p>
                    <p>
                        Tous les sites ont été mis à jour dans les 6 derniers
                        mois
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import FilArianne from "../DonneesStatistiques/FilArianne.vue";
import Title from "../DonneesStatistiques/Title.vue";
import Header from "../DonneesStatistiques/Header.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    city: {
        type: Object,
        required: true,
    },
    metrics: {
        type: Object,
        required: true,
    },
});
const { city, metrics } = toRefs(props);
</script>
