<template>
    <ContentWrapper>
        <ViewHeader icon="building">
            <template v-slot:title
                >Fiche structure -
                <span class="text-primary">{{
                    organization.name
                }}</span></template
            >
            <template v-slot:description>
                Consultez les informations sur cette structure et ses membres
                détenant des comptes actifs sur la plateforme
            </template>
        </ViewHeader>

        <FicheStructureInfos :organization="organization" />
        <FicheStructureFiltres
            v-if="filteredUsers.length > 0"
            v-model="expertiseTopicsFilter"
            class="mb-6"
        />
        <FicheStructureWarningFiltreActif
            v-if="
                expertiseTopicsFilter.length > 0 &&
                organization.users.length !== filteredUsers.length
            "
            :numberOfHiddenUsers="
                organization.users.length - filteredUsers.length
            "
            class="mb-6"
            @resetFilters="() => (expertiseTopicsFilter = [])"
        />

        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:auto-rows-fr"
            v-if="filteredUsers.length > 0"
        >
            <CarteUtilisateur
                v-for="user in filteredUsers"
                :key="user.id"
                :user="user"
                :topics="expertiseTopicsFilter"
            />
        </div>
        <ViewError v-else variant="vide">
            <template v-slot:title>Aucun utilisateur</template>
            <template v-slot:code>{{
                expertiseTopicsFilter.length > 0
                    ? "Aucun utilisateur pour les filtres choisis"
                    : "Aucun utilisateur"
            }}</template>
            <template v-slot:content
                >Cette structure ne compte aucun utilisateur actif ou inscrit
                sur la plateforme{{
                    expertiseTopicsFilter.length > 0
                        ? " avec les sujets d'expertise demandés"
                        : ""
                }}.</template
            >
            <template v-slot:actions>&nbsp;</template>
        </ViewError>
    </ContentWrapper>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import { ContentWrapper } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import FicheStructureFiltres from "./FicheStructureFiltres.vue";
import FicheStructureInfos from "./FicheStructureInfos.vue";
import FicheStructureWarningFiltreActif from "./FicheStructureWarningFiltreActif.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const props = defineProps({
    organization: {
        type: Object,
        required: true,
    },
});
const { organization } = toRefs(props);
const directoryStore = useDirectoryStore();
const expertiseTopicsFilter = ref(directoryStore.filters.expertiseTopics || []);

const filteredUsers = computed(() => {
    if (expertiseTopicsFilter.value.length === 0) {
        return organization.value.users;
    }

    return organization.value.users.filter((user) => {
        return (user?.expertise_topics || []).some(({ uid }) =>
            expertiseTopicsFilter.value.includes(uid)
        );
    });
});
</script>
