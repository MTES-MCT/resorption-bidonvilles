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
        <FicheStructureFiltres v-model="expertiseTopicsFilter" class="mb-6" />
        <div
            v-if="
                expertiseTopicsFilter.length > 0 &&
                organization.users.length !== filteredUsers.length
            "
            class="flex gap-4 bg-G200 border-l-4 border-blue400 px-4 py-6 mb-6"
        >
            <Icon icon="circle-info" />
            <div class="pt-6">
                <h3 class="font-bold text-xl">Filtre actif</h3>
                <p>
                    Attention, la liste des membres de cette structure est
                    actuellement filtrée par sujets d'expertise.<br />
                    <template
                        v-if="
                            organization.users.length - filteredUsers.length > 1
                        "
                    >
                        <span class="font-bold"
                            >{{
                                organization.users.length - filteredUsers.length
                            }}
                            utilisateurs</span
                        >
                        sont actuellement masqués.
                    </template>
                    <template v-else>
                        <span class="font-bold">1 utilisateur</span> est
                        actuellement masqué.
                    </template>
                </p>
                <RbButton
                    size="sm"
                    @click="expertiseTopicsFilter = []"
                    class="mt-4"
                    >Cliquez ici pour retirer ce filtre</RbButton
                >
            </div>
        </div>

        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr"
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
            <template v-slot:title
                >Aucun résultat pour cette recherche</template
            >
            <template v-slot:code>Filtres actifs</template>
            <template v-slot:content
                >Il semblerait qu'il n'existe aucun membre de cette structure
                répondant à vos critères.</template
            >
            <template v-slot:actions>&nbsp;</template>
        </ViewError>
    </ContentWrapper>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import {
    ContentWrapper,
    Icon,
    Button as RbButton,
} from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import FicheStructureFiltres from "./FicheStructureFiltres.vue";
import FicheStructureInfos from "./FicheStructureInfos.vue";
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
