<template>
    <ContentWrapper>
        <ViewHeader icon="handshake-angle" direction="col">
            <template v-slot:title>
                <FicheActionHeaderName :action="action" />
            </template>
            <template v-slot:actionId>
                Identifiant de l'action :
                <DsfrTagCopy
                    :label="action.displayId"
                    dataType="L'identifiant de l'action"
                />
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
import { toRefs } from "vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import FicheActionHeaderName from "./FicheActionHeaderName.vue";
import FicheActionHeaderStatus from "./FicheActionHeaderStatus.vue";
import FicheActionHeaderBoutons from "./FicheActionHeaderBoutons.vue";
import DsfrTagCopy from "@/components/DsfrTagCopy/DsfrTagCopy.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
