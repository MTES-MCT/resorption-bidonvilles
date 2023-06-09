<template>
    <FilArianne />
    <Title class="mt-6">{{ departement.name }} ({{ departement.code }})</Title>
    <Header class="mt-4" />

    <section
        class="mt-6 bg-G100 border border-G300 rounded py-4 px-6 flex items-stretch"
    >
        <div class="flex space-x-5 self-center flex-1">
            <p><span class="font-bold text-3xl">775</span><br />sites</p>
            <p><span class="font-bold text-3xl">2300</span><br />personnes</p>
        </div>
        <div class="w-px bg-G300 mx-6"></div>
        <div>
            <p>Sites avec exclusivement des ressortissants européens</p>
            <div class="flex space-x-5">
                <p><span class="font-bold text-lg">112</span><br />sites</p>
                <p>
                    <span class="font-bold text-lg">1200</span><br />personnes
                </p>
            </div>
        </div>
        <div class="w-px bg-G300 mx-6"></div>
        <div>
            <div class="text-error flex space-x-2">
                <p><Icon icon="times" /></p>
                <p>
                    12 sites sans nombre de personnes ou indications de
                    l'origine
                </p>
            </div>
            <div class="text-success flex space-x-2">
                <p><Icon icon="check" /></p>
                <p>
                    Tous les sites ont été mis à jour dans les 6 derniers mois
                </p>
            </div>
        </div>
    </section>

    <main class="mt-6">
        <Vues />

        <div class="mt-6 flex justify-evenly items-stretch">
            <div class="flex-1 pr-6">
                <table class="w-full data-table">
                    <thead>
                        <tr class="text-xl">
                            <th class="text-left text-md">
                                <div class="flex justify-between">
                                    <span>Commune</span>
                                    <span class="text-md text-G600"
                                        ><Icon icon="chevron-down"
                                    /></span>
                                </div>
                            </th>
                            <th class="text-right">
                                <Icon icon="map-pin" />
                                <span class="ml-2 text-md text-G600"
                                    ><Icon icon="chevron-down"
                                /></span>
                            </th>
                            <th class="text-right">
                                <Icon icon="person" />
                                <span class="ml-2 text-md text-G600"
                                    ><Icon icon="chevron-down"
                                /></span>
                            </th>
                            <th class="text-right">
                                <Icon icon="faucet-drip" />
                                <span class="ml-2 text-md text-G600"
                                    ><Icon icon="chevron-down"
                                /></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="text-right data-table-header">
                            <th class="text-left font-normal">
                                <span class="font-bold">Stain</span><br /><span
                                    class="text-sm"
                                    >93072</span
                                >
                            </th>
                            <th class="font-normal">1234<br />&nbsp;</th>
                            <th class="font-normal">123<br />&nbsp;</th>
                            <th class="font-normal">
                                1112<br /><span class="text-sm">(56 %)</span>
                            </th>
                        </tr>
                        <tr class="bg-G100 text-right">
                            <td class="text-left">
                                209 boulevard Maxime Gorki<br /><span
                                    class="text-sm"
                                    >Bâtiment public</span
                                >
                            </td>
                            <td></td>
                            <td>67<br />&nbsp;</td>
                            <td class="text-lg text-success">
                                <Icon icon="check" /><br />&nbsp;
                            </td>
                        </tr>
                        <tr class="bg-G200 text-right">
                            <td class="text-left">
                                209 boulevard Maxime Gorki<br /><span
                                    class="text-sm"
                                    >Bâtiment public</span
                                >
                            </td>
                            <td></td>
                            <td>67<br />&nbsp;</td>
                            <td class="text-lg text-error">
                                <Icon icon="times" /><br />&nbsp;
                            </td>
                        </tr>
                        <tr class="bg-blue200 text-right">
                            <td class="text-left font-bold">Total</td>
                            <td>1234</td>
                            <td>123</td>
                            <td>1112</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-1 bg-blue300 relative">
                <div
                    class="absolute top-0 left-0 w-4 -ml-2 z-[3000] text-primary font-bold text-center"
                >
                    <div
                        class="bg-blue300 rounded-t cursor-pointer hover:bg-blue200"
                    >
                        &lt;
                    </div>
                    <div
                        class="bg-blue300 rounded-b cursor-pointer hover:bg-blue200"
                    >
                        &gt;
                    </div>
                </div>
            </div>
            <div class="flex-1 h-128">
                <Carte :mapOptions="{ dragging: false }" />
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.data-table thead th,
.data-table tbody th,
.data-table tbody td {
    @apply px-2;
}

.data-table thead th:hover {
    @apply bg-G200 cursor-pointer;
}
.data-table tbody tr:not(.data-table-header):hover {
    @apply bg-G600 cursor-pointer text-white;
}

.data-table tbody th,
.data-table tbody td {
    @apply border-y border-G400;
}

.data-table tbody th:not(:last-child),
.data-table tbody td:not(:last-child) {
    @apply border-r;
}

.data-table thead th:not(:last-child) {
    @apply border-r;
}

.data-table-header {
    @apply bg-blue300;

    th:not(:last-child) {
        @apply border-x-blue400;
    }
}
</style>

<script setup>
import { toRefs } from "vue";
import FilArianne from "../DonneesStatistiques/FilArianne.vue";
import Title from "../DonneesStatistiques/Title.vue";
import Header from "../DonneesStatistiques/Header.vue";
import Vues from "../DonneesStatistiques/Vues.vue";
import { Icon } from "@resorptionbidonvilles/ui";
import Carte from "@/components/Carte/Carte.vue";

const props = defineProps({
    departement: {
        type: Object,
        required: true,
    },
    metrics: {
        type: Object,
        required: true,
    },
});
const { departement, metrics } = toRefs(props);
</script>
