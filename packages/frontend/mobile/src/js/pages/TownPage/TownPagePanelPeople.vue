<template>
    <div>
        <TownPagePanelTitle :title="'Habitants'" />
        <div class="flex flex-col">
            <TownPageInfo
                v-for="section in data"
                :key="section.title"
                :title="section.title"
            >
                {{ town[section.content] || "Non communiqué" }}
            </TownPageInfo>
        </div>
    </div>
</template>
<script>
import TownPageInfo from "./TownPageInfo.vue";
import TownPagePanelTitle from "./TownPagePanelTitle.vue";

export default {
    data() {
        return {
            data: [
                { title: "Nombre de personnes", content: "populationTotal" },
                { title: "Nombre de ménages", content: "populationCouples" },
                { title: "Nombre de mineurs", content: "populationMinors" },
                { title: "0 - 3 ans", content: "populationMinors0To3" },
                { title: "3 - 6 ans", content: "populationMinors3To6" },
                { title: "6 - 12 ans", content: "populationMinors6To12" },
                { title: "12 - 16 ans", content: "populationMinors12To16" },
                { title: "16 - 18 ans", content: "populationMinors16To18" },
                {
                    title: "Inscrits en établissement scolaire",
                    content: "minorsInSchool",
                },
                { title: "Nombre de caravanes", content: "caravans" },
                { title: "Nombre de cabanes", content: "huts" },
            ],
        };
    },
    props: {
        town: {
            type: Object,
            required: true,
        },
    },
    components: {
        TownPageInfo,
        TownPagePanelTitle,
    },
};
</script>
