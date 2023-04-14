<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title> {{ wording.title }} </template>
        <template v-slot:body>
            <div class="pt-2">
                <Loading v-if="loading !== false" />
                <ViewErrorInline v-else-if="error">
                    <template v-slot:title
                        >Collecte des données échouée</template
                    >
                    <template v-slot:content>{{ error }}</template>
                    <template v-slot:actions>&nbsp;</template>
                </ViewErrorInline>
                <p v-else-if="organizationList.length === 0">
                    <Icon icon="lock" class="text-red" />
                    {{ wording.emptyList }}
                </p>
                <template v-else>
                    <p>
                        <span class="font-bold text-primary"
                            >{{ numberOfUsers }} utilisateurs</span
                        >
                        {{ wording.fullList }}<br />
                        <em
                            >en plus des préfectures et DEETS / DDETS /
                            DREETS</em
                        >
                    </p>
                    <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CarteStructure
                            v-for="organization in organizationList"
                            :key="organization.id"
                            :organization="organization"
                            :showWording="false"
                        />
                    </div>
                </template>
            </div>
        </template>
        <template v-slot:footer>
            <Button
                v-if="loading === false && error"
                type="button"
                class="mr-4"
                icon="rotate-left"
                iconPosition="left"
                variant="primaryOutline"
                @click="delayedLoad"
                >Réessayer</Button
            >
            <Button type="button" @click="close">
                <template v-if="loading !== false || error">Fermer</template>
                <template v-else>J'ai compris</template>
            </Button>
        </template>
    </Modal>
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
import { Button, Modal, Icon } from "@resorptionbidonvilles/ui";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import CarteStructure from "@/components/CarteStructure/CarteStructure.vue";
import { getActionFinancementsReadersByAction } from "@/api/actions.api";
import { getActionsFinancesdReaders } from "@/api/action_finances_readers.api";
import Loading from "@/components/Loading/Loading.vue";
import computeOrganizationLocation from "@/utils/computeOrganizationLocation";

const props = defineProps({
    actionId: Number,
    managers: Array,
    future: Boolean,
});
const { actionId, managers, future } = toRefs(props);

const wording = computed(() => {
    if (future.value === true) {
        return {
            title: "Qui aura accès aux données sur les financements de l'action ?",
            emptyList:
                "Seuls les utilisateurs en préfecture et DEETS / DREETS auront accès aux données sur les financements de cette action.",
            fullList: `${
                numberOfUsers.value > 0 ? "auront" : "aura"
            } accès aux données sur les financements de cette action`,
        };
    }

    return {
        title: "Qui a accès aux données sur les financements de cette action ?",
        emptyList:
            "Seuls les utilisateurs en préfecture et DEETS / DREETS ont accès aux données sur les financements de cette action.",
        fullList: `${
            numberOfUsers.value > 0 ? "ont" : "a"
        } accès aux données sur les financements de cette action`,
    };
});
const organizationList = ref([]);
const loading = ref(null);
const error = ref(null);
const numberOfUsers = computed(() => {
    return organizationList.value.reduce((total, organization) => {
        return total + organization.users.length;
    }, 0);
});

async function load() {
    if (loading.value === true) {
        return;
    }

    organizationList.value = [];
    loading.value = true;
    error.value = null;

    try {
        organizationList.value = (await fetch()).map((org) => {
            const location = computeOrganizationLocation(org);
            org.location_name = location.name;
            org.location_code = location.code;

            return org;
        });
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }
    loading.value = false;
}

function fetch() {
    if (actionId.value !== null && actionId.value !== undefined) {
        return getActionFinancementsReadersByAction(actionId.value);
    }
    return getActionsFinancesdReaders({ managers: managers.value });
}

// le load décalé est nécessaire parce que dès l'instant où le load démarre le bouton "Réessayer"
// disparaît et le checkOutsideClick provoque alors la fermeture de la modale
function delayedLoad() {
    setTimeout(load, 100);
}

const isOpen = ref(false);

watch(actionId, reset);

watch(isOpen, () => {
    if (isOpen.value === true && loading.value === null) {
        load();
    }
});

function reset() {
    loading.value = null;
    organizationList.value = [];
}

function close() {
    isOpen.value = false;
}

defineExpose({
    open() {
        isOpen.value = true;
    },
    wording,
});
</script>
