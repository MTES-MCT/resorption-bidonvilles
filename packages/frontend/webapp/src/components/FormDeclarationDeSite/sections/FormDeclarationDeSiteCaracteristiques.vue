<template>
    <FormSection id="caracteristiques">
        <template v-slot:title>Caractéristiques du site</template>

        <Fieldset legend="Quelles sont les dates clés du site ?">
            <InputBuiltAt width="w-64" />
            <InputDeclaredAt width="w-64" />
            <InputFieldType />
            <InputDetailedAddress />
        </Fieldset>

        <Fieldset legend="Quel est le propriétaire ?" showMandatoryStar>
            <!-- <InputOwnerType />
            <InputOwner
                v-if="
                    values.owner_type &&
                    values.owner_type !== unknownOwnerTypeId &&
                    userStore.hasOwnerPermission
                "
            /> -->

            <div
                v-for="(owner, index) in sortedOwners"
                :key="owner.ownerId || owner.name"
            >
                <div
                    v-if="
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
                            <i class="fa-solid fa-circle-plus text-blue500" />
                            Nouveau propriétaire
                        </p>
                        <p v-else class="font-bold">
                            Propriétaire {{ index + 1 }}
                        </p>
                        <DsfrButton
                            class=""
                            icon="fr-icon-delete-line"
                            icon-only
                            label="Effacer le propriétaire"
                            no-outline
                            tertiary
                            size="sm"
                            @click.prevent="removeOwner(owner)"
                        />
                    </div>
                    <div
                        class="flex flex-row justify-evenly items-center gap-4 w-full pb-4"
                    >
                        <InputOwner
                            class="w-2/3 !mb-0"
                            v-if="
                                values.owner_type &&
                                values.owner_type !== unknownOwnerTypeId &&
                                userStore.hasOwnerPermission
                            "
                            :name="`owner.owners[${getOriginalIndex(
                                owner
                            )}].name`"
                            :disabled="!owner.active"
                        />
                        <InputOwnerType
                            class="w-auto !mb-0"
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
                    @click.prevent="
                        values.owner.owners.push({
                            ownerId: null,
                            name: '',
                            type: unknownOwnerTypeId,
                            active: true,
                        })
                    "
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
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { computed, ref } from "vue";
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

const values = useFormValues();
const userStore = useUserStore();
const showDeletedOwners = ref(false);

const sortedOwners = computed(() => {
    const owners = values.value.owner?.owners ?? [];
    // On crée une copie pour ne pas muter l'état original
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
    return values.value.owner?.owners.findIndex((o) => o === ownerToFind);
};

const removeOwner = (ownerToRemove) => {
    const index = getOriginalIndex(ownerToRemove);
    if (index !== -1) {
        values.value.owner.owners.splice(index, 1);
    }
};

const unknownOwnerTypeId = computed(() => {
    const configStore = useConfigStore();
    const type = configStore.config.owner_types.find(
        ({ label }) => label === "Inconnu"
    );
    return type.id;
});

const displayFullOwnersList = () => {
    showDeletedOwners.value = !showDeletedOwners.value;
    if (!showDeletedOwners.value) {
        values.value.owner.owners = values.value.owner.owners.filter(
            (owner) => owner.active
        );
    }
};
</script>
