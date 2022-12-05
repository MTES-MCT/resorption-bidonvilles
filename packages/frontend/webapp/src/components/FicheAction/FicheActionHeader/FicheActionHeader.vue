<template>
    <ContentWrapper>
        <ViewHeader icon="handshake-angle" direction="col">
            <template v-slot:title>
                <span>{{ plan.name }}</span>
            </template>
            <template v-slot:description>
                <FicheActionHeaderStatus :plan="plan" />
            </template>
            <template v-slot:actions>
                <FicheActionHeaderBoutons :plan="plan" />
            </template>
        </ViewHeader>
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FicheActionHeaderStatus from "./FicheActionHeaderStatus.vue";
import FicheActionHeaderBoutons from "./FicheActionHeaderBoutons.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
