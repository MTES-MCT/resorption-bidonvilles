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
import { ref, watch } from "vue";
import { useFieldValue } from "vee-validate";
import InputAddress from "@/components/InputAddress/InputAddress.vue";
import InputCoordinates from "@/components/InputCoordinates/InputCoordinates.vue";
import labels from "../FormDeclarationAction.labels";

const props = defineProps({
    setFieldValue: {
        type: Function,
        required: true,
    },
});

const locationEtiAddresses = useFieldValue("location_eti_addresses");

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

console.log("📍 Initialisation addresses:", addresses.value);

// Watch pour synchroniser avec vee-validate
watch(
    addresses,
    (newAddresses) => {
        // Synchroniser avec vee-validate
        const cleanedAddresses = newAddresses.map((addr) => {
            const cleanedAddr = { ...addr };
            delete cleanedAddr._uid;
            return cleanedAddr;
        });

        console.log("cleanedAddresses pour setFieldValue:", cleanedAddresses);
        props.setFieldValue("location_eti_addresses", cleanedAddresses);
    },
    { deep: true }
);

function addAddress() {
    console.log("➕ addAddress appelé, avant:", addresses.value.length);

    // Ajouter une adresse vide
    const newAddress = {
        address: null,
        coordinates: null,
        _uid: generateUniqueId(),
    };

    addresses.value.push(newAddress);
    console.log("➕ addAddress terminé, après:", addresses.value.length);

    // Forcer la mise à jour du champ du formulaire
    const cleanedAddresses = addresses.value.map(
        // eslint-disable-next-line no-unused-vars
        ({ _uid, ...addr }) => addr
    );
    console.log("📝 Mise à jour forcée après addAddress:", cleanedAddresses);
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
