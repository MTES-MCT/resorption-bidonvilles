<template>
    <ContentWrapper>
        <ViewHeader icon="building">
            <template v-slot:title
                >Fiche structure —
                <span class="text-info">{{ organization.name }}</span></template
            >
            <template v-slot:description>
                Consultez les informations sur cette structure et ses membres
                détenant des comptes actifs sur la plateforme
            </template>
        </ViewHeader>

        <FicheStructureInfos :organization="organization" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr">
            <CarteUtilisateur
                v-for="user in organization.users"
                :key="user.id"
                :user="user"
            />
        </div>
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import FicheStructureInfos from "./FicheStructureInfos.vue";

const props = defineProps({
    organization: {
        type: Object,
        required: true,
    },
});
const { organization } = toRefs(props);
</script>
