<template>
    <ContentWrapper>
        <ViewHeader icon="tent" direction="col">
            <template v-slot:title>
                <FicheSiteHeaderName :town="town" />
            </template>
            <template v-slot:description>
                <FicheSiteHeaderStatus :town="town" />
            </template>
            <template v-slot:actions>
                <FicheSiteHeaderBoutons :town="town" />
            </template>
        </ViewHeader>
    </ContentWrapper>
</template>

<script setup>
import { toRefs } from "vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FicheSiteHeaderName from "./FicheSiteHeaderName.vue";
import FicheSiteHeaderStatus from "./FicheSiteHeaderStatus.vue";
import FicheSiteHeaderBoutons from "./FicheSiteHeaderBoutons.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
