<template>
    <ContentWrapper>
        <ViewHeader icon="handshake-angle" direction="col">
            <template v-slot:title>
                <span>{{ action.name }}</span>
            </template>
            <template v-slot:description>
                <FicheActionHeaderStatus :action="action" />
            </template>
            <template v-slot:actions>
                <FicheActionHeaderBoutons :action="action" />
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
    action: Object,
});
const { action } = toRefs(props);
</script>
