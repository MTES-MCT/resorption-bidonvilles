<template>
    <div class="fr-mb-4w">
        <div
            v-for="(address, index) in addresses"
            :key="address._uid"
            class="fr-mb-3w fr-p-3w"
            :class="{ 'fr-background-alt--blue-france': addresses.length > 1 }"
        >
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                <div class="fr-col-12">
                    <h4 v-if="addresses.length > 1" class="fr-h6 fr-mb-2w">
                        Adresse {{ index + 1 }}
                    </h4>
                </div>
            </div>

            <div class="mb-12">
                <InputAddress
                    :id="`location_eti_addresses_${index}_address`"
                    :name="`location_eti_addresses[${index}].address`"
                    :label="index === 0 ? labels.location_eti : 'Adresse'"
                    :showMandatoryStar="index === 0"
                    v-model="address.address"
                />
            </div>

            <section class="h-96 bg-G500 fr-mt-2w" v-if="address.address?.data">
                <InputCoordinates
                    :mapId="`location_eti_addresses_${index}_coordinates`"
                    :name="`location_eti_addresses[${index}].coordinates`"
                    :initialCoordinates="address.address.data.coordinates"
                    v-model="address.coordinates"
                />
            </section>

            <div v-if="addresses.length > 1" class="fr-mt-6w">
                <DsfrButton
                    secondary
                    size="sm"
                    icon="fr-icon-delete-line"
                    @click="removeAddress(index)"
                    :aria-label="`Supprimer l'adresse ${index + 1}`"
                >
                    Supprimer cette adresse
                </DsfrButton>
            </div>
        </div>

        <DsfrButton
            secondary
            icon="fr-icon-add-line"
            @click.prevent.stop="addAddress"
        >
            Ajouter une adresse
        </DsfrButton>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useFieldValue, useFormErrors } from "vee-validate";
import InputAddress from "@/components/InputAddress/InputAddress.vue";
import InputCoordinates from "@/components/InputCoordinates/InputCoordinates.vue";
import labels from "../FormDeclarationAction.labels";

const formErrors = useFormErrors();

const props = defineProps({
    setFieldValue: {
        type: Function,
        required: true,
    },
    setErrors: {
        type: Function,
        required: true,
    },
});

const locationEtiAddresses = useFieldValue("location_eti_addresses");
const duplicateErrors = ref({});
const hasDuplicates = computed(
    () => Object.keys(duplicateErrors.value).length > 0
);

// Exposer hasDuplicates pour le composant parent
defineExpose({
    hasDuplicates,
});

function normalizeAddressForComparison(address) {
    return String(address)
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .replaceAll(/['''\u2019]/g, "'")
        .toLowerCase()
        .trim();
}

function createAddressKey(addr) {
    if (!addr?.address?.data) {
        return null;
    }
    const normalizedAddress = normalizeAddressForComparison(
        addr.address.data.label
    );
    const coords = addr.address.data.coordinates || addr.coordinates;
    return `${normalizedAddress}|${addr.address.data.citycode}|${
        Array.isArray(coords) ? coords.join(",") : coords
    }`;
}

function checkDuplicates() {
    const seenAddresses = new Map();
    const duplicateIndices = new Set();

    addresses.value.forEach((addr, index) => {
        const addressKey = createAddressKey(addr);

        if (addressKey) {
            if (seenAddresses.has(addressKey)) {
                duplicateIndices.add(index);
                duplicateIndices.add(seenAddresses.get(addressKey));
            } else {
                seenAddresses.set(addressKey, index);
            }
        }
    });

    // Construire l'objet d'erreurs pour vee-validate
    const errorsToSet = {};
    const newErrors = {};

    // Définir les erreurs de doublons
    duplicateIndices.forEach((index) => {
        const errorMessage = "Cette adresse est déjà présente dans la liste";
        const fieldName = `location_eti_addresses[${index}].address`;
        errorsToSet[fieldName] = errorMessage;
        newErrors[index] = errorMessage;
    });

    // Nettoyer TOUTES les erreurs de doublons existantes
    // puis réappliquer seulement celles qui sont valides
    Object.keys(formErrors.value).forEach((fieldName) => {
        if (
            fieldName.startsWith("location_eti_addresses[") &&
            fieldName.endsWith("].address") &&
            formErrors.value[fieldName] ===
                "Cette adresse est déjà présente dans la liste"
        ) {
            // Si ce champ n'est pas dans les erreurs actuelles, le nettoyer
            if (!errorsToSet[fieldName]) {
                errorsToSet[fieldName] = undefined;
            }
        }
    });

    // Appliquer toutes les erreurs en une seule fois
    props.setErrors(errorsToSet);

    duplicateErrors.value = newErrors;
}

// Générer un ID unique pour chaque adresse
let uniqueIdCounter = 0;
function generateUniqueId() {
    return `addr_${Date.now()}_${uniqueIdCounter++}`;
}

// Initialiser avec une adresse vide si aucune adresse n'existe
const addresses = ref(
    locationEtiAddresses.value && locationEtiAddresses.value.length > 0
        ? locationEtiAddresses.value.map((addr) => {
              const addressObj = {
                  ...addr,
                  _uid: addr._uid || generateUniqueId(),
              };

              // S'assurer que address a la bonne structure pour InputAddress
              if (addr.address && typeof addr.address === "string") {
                  addressObj.address = {
                      data: {
                          label: addr.address,
                          citycode: addr.citycode,
                          coordinates:
                              addr.coordinates?.split(",").map(Number) || [],
                      },
                  };
              }

              return addressObj;
          })
        : [{ address: null, coordinates: null, _uid: generateUniqueId() }]
);

// Watch pour synchroniser avec vee-validate et vérifier les doublons
watch(
    addresses,
    (newAddresses) => {
        // Synchroniser avec vee-validate
        const cleanedAddresses = newAddresses.map((addr) => {
            const cleanedAddr = { ...addr };
            delete cleanedAddr._uid;
            return cleanedAddr;
        });

        props.setFieldValue("location_eti_addresses", cleanedAddresses);

        // Vérifier les doublons après chaque modification
        checkDuplicates();
    },
    { deep: true }
);

function addAddress() {
    // Ajouter une adresse vide
    const newAddress = {
        address: null,
        coordinates: null,
        _uid: generateUniqueId(),
    };

    addresses.value.push(newAddress);

    // Forcer la mise à jour du champ du formulaire
    const cleanedAddresses = addresses.value.map(
        // eslint-disable-next-line no-unused-vars
        ({ _uid, ...addr }) => addr
    );
    props.setFieldValue("location_eti_addresses", cleanedAddresses);
}

function removeAddress(index) {
    if (addresses.value.length > 1) {
        addresses.value.splice(index, 1);
    }
}
</script>

<style scoped>
.h-96 {
    height: 24rem;
}

.bg-G500 {
    background-color: #f6f6f6;
}
</style>
