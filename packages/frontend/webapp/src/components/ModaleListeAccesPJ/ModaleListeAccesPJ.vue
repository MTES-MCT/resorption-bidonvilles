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
                        <em>hors préfectures et DEETS / DREETS</em>
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
import { defineExpose, ref, toRefs, watch, computed } from "vue";
import { Button, Modal, Icon } from "@resorptionbidonvilles/ui";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import CarteStructure from "@/components/CarteStructure/CarteStructure.vue";
import { getJusticeReaders as getJusticeReadersByShantytown } from "@/api/towns.api";
import { get as getJusticeReadersByLocation } from "@/api/justice_readers.api";
import Loading from "@/components/Loading/Loading.vue";
import computeOrganizationLocation from "@/utils/computeOrganizationLocation";

const props = defineProps({
    townId: Number,
    location: Object,
    future: Boolean,
});
const { townId, location, future } = toRefs(props);

const wording = computed(() => {
    if (future.value === true) {
        return {
            title: "Qui aura accès aux données sur la procédure judiciaire ?",
            emptyList:
                "Seuls les utilisateurs en préfecture et DEETS / DREETS auront accès aux données judiciaires de ce site.",
            fullList: "auront accès aux données judiciaires de ce site",
        };
    }

    return {
        title: "Qui a accès aux données sur la procédure judiciaire ?",
        emptyList:
            "Seuls les utilisateurs en préfecture et DEETS / DREETS a accès aux données judiciaires de ce site.",
        fullList: "a accès aux données judiciaires de ce site",
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
    if (townId.value !== null && townId.value !== undefined) {
        return getJusticeReadersByShantytown(townId.value);
    }

    if (!location.value) {
        throw new Error("Localisation ou site est obligatoire");
    }

    return getJusticeReadersByLocation(
        location.value.type,
        location.value[location.value.type].code
    );
}

// le load décalé est nécessaire parce que dès l'instant où le load démarre le bouton "Réessayer"
// disparaît et le checkOutsideClick provoque alors la fermeture de la modale
function delayedLoad() {
    setTimeout(load, 100);
}

const isOpen = ref(false);

watch(townId, reset);
watch(location, reset);
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
