<template>
    <FormSection id="caracteristiques">
        <template v-slot:title>Caractéristiques du site</template>

        <Fieldset legend="Quelles sont les dates clés du site ?">
            <InputBuiltAt width="w-64" />
            <InputDeclaredAt width="w-64" />
            <InputFieldType />
            <InputDetailedAddress />
        </Fieldset>

        <Fieldset
            legend="Quel est le propriétaire ?"
            showMandatoryStar
            id="owner"
        >
            <div v-if="userStore.hasOwnerPermission">
                <div v-for="(owner, index) in sortedOwners" :key="owner._key">
                    <div
                        v-show="
                            (!showDeletedOwners && owner.active) ||
                            showDeletedOwners
                        "
                        class="flex flex-col justify-evenly items-center border border-primary rounded mb-4 px-4"
                        :class="
                            (!owner.ownerId ? 'shadow-lg' : '',
                            !owner.active ? 'opacity-50 bg-G200' : '')
                        "
                    >
                        <div
                            class="w-full p-2 rounded text-sm font-bold mt-2 mb-3 space-between flex flex-row justify-between items-center"
                            :class="owner.ownerId ? 'bg-G200' : 'bg-blue200'"
                        >
                            <p v-if="!owner.ownerId" class="font-bold">
                                <i
                                    class="fa-solid fa-circle-plus text-blue500"
                                />
                                Nouveau propriétaire
                            </p>
                            <p v-else class="font-bold">
                                Propriétaire {{ index + 1 }}
                            </p>
                            <DsfrButton
                                v-if="owner.active"
                                class=""
                                icon="fr-icon-delete-line"
                                icon-only
                                label="Effacer le propriétaire"
                                no-outline
                                tertiary
                                size="sm"
                                @click.prevent="
                                    removeOwner(owner, getOriginalIndex(owner))
                                "
                            />
                        </div>
                        <div
                            class="flex flex-row justify-evenly items-center gap-4 w-full pb-4"
                        >
                            <InputOwner
                                class="w-2/3 !mb-0"
                                :id="`owner.owners[${getOriginalIndex(
                                    owner
                                )}].name`"
                                :name="`owner.owners[${getOriginalIndex(
                                    owner
                                )}].name`"
                                :disabled="!owner.active"
                            />
                            <InputOwnerType
                                class="w-auto !mb-0"
                                :id="`owner.owners[${getOriginalIndex(
                                    owner
                                )}].type`"
                                :name="`owner.owners[${getOriginalIndex(
                                    owner
                                )}].type`"
                                :disabled="!owner.active"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-2 justify-between">
                    <DsfrButton
                        icon="fr-icon-user-add-fill"
                        label="Ajouter un propriétaire"
                        @click.prevent="addOwner"
                    />
                    <DsfrButton
                        :icon="
                            showDeletedOwners
                                ? 'fr-icon-eye-off-line'
                                : 'fr-icon-eye-fill'
                        "
                        :label="`${
                            showDeletedOwners ? 'Masquer' : 'Afficher'
                        } les anciens propriétaires connus`"
                        tertiary
                        @click.prevent="displayFullOwnersList"
                    />
                </div>
            </div>
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useFormValues } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";
import { useUserStore } from "@/stores/user.store";
import { Fieldset } from "@resorptionbidonvilles/ui";

import FormSection from "@/components/FormSection/FormSection.vue";
import InputBuiltAt from "../inputs/FormDeclarationDeSiteInputBuiltAt.vue";
import InputDeclaredAt from "../inputs/FormDeclarationDeSiteInputDeclaredAt.vue";
import InputFieldType from "../inputs/FormDeclarationDeSiteInputFieldType.vue";
import InputDetailedAddress from "../inputs/FormDeclarationDeSiteInputDetailedAddress.vue";
import InputOwnerType from "../inputs/FormDeclarationDeSiteInputOwnerType.vue";
import InputOwner from "../inputs/FormDeclarationDeSiteInputOwner.vue";

const props = defineProps({
    set_field_value: {
        type: Function,
        required: false,
    },
});

const values = useFormValues();
const userStore = useUserStore();
const showDeletedOwners = ref(false);

const generateUniqueKey = () =>
    `key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

onMounted(() => {
    if (!values.value.owner?.owners) {
        props.set_field_value("owner.owners", []);
    } else {
        const ownersWithKeys = values.value.owner.owners.map((owner) => ({
            ...owner,
            _key: owner._key || generateUniqueKey(),
        }));
        props.set_field_value("owner.owners", ownersWithKeys, false);
    }
});

// Initialisation des owners si nécessaire
if (!values.value.owner?.owners) {
    values.value.owner = { owners: [] };
}

const sortedOwners = computed(() => {
    const owners = values.value.owner?.owners ?? [];

    return [...owners].sort((a, b) => {
        if (a.active !== b.active) {
            return a.active ? -1 : 1;
        }

        if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
    });
});

const getOriginalIndex = (ownerToFind) => {
    if (!ownerToFind?._key || !values.value.owner?.owners) {
        return -1;
    }
    return values.value.owner.owners.findIndex(
        (o) => o._key === ownerToFind._key
    );
};

const removeOwner = (ownerToRemove, sortedIndex) => {
    if (ownerToRemove.ownerId) {
        const updatedOwner = {
            ...ownerToRemove,
            active: false,
        };
        props.set_field_value(`owner.owners[${sortedIndex}]`, updatedOwner);
    } else {
        values.value.owner.owners.splice(sortedIndex, 1);
    }
};

const unknownOwnerTypeId = computed(() => {
    const configStore = useConfigStore();
    const type = configStore.config.owner_types.find(
        ({ label }) => label === "Inconnu"
    );
    return type.id;
});

const addOwner = () => {
    const newOwner = {
        _key: generateUniqueKey(),
        ownerId: null,
        name: "",
        type: unknownOwnerTypeId.value,
        active: true,
    };
    const newOwners = [...(values.value.owner.owners || []), newOwner];
    props.set_field_value("owner.owners", newOwners);
};

const displayFullOwnersList = () => {
    showDeletedOwners.value = !showDeletedOwners.value;
};
</script>
