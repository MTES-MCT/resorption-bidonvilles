<template>
    <FormSection id="adresse" variant="blue">
        <template v-slot:title>Localisation</template>
        <div class="flex flex-col lg:flex-row">
            <section class="flex-1">
                <FormParagraph title="Adresse" showMandatoryStar id="address">
                    <InputAddress v-model="values.address" />
                    <!-- v-model="values.address" /> -->
                </FormParagraph>

                <div class="text-sm mb-4" v-if="nearbyShantytowns.length">
                    <p>
                        <span class="font-bold"
                            ><template v-if="nearbyShantytowns.length === 1"
                                >1 site est déjà enregistré</template
                            >
                            <template v-else>
                                {{ nearbyShantytowns.length }} sites sont déjà
                                enregistrés
                            </template></span
                        >
                        dans un rayon de 500 mètres autour de cette adresse.
                        Assurez-vous de ne pas déclarer un site déjà enregistré
                        sur la plateforme :
                    </p>
                    <ul class="list-disc ml-4">
                        <li
                            v-for="town in nearbyShantytowns.slice(0, 5)"
                            :key="town.id"
                        >
                            <Link :to="`/site/${town.id}`">
                                {{ town.usename }}
                                <span>
                                    ({{ town.distance.toFixed(2) }} km)</span
                                >
                            </Link>
                        </li>
                    </ul>
                </div>

                <FormParagraph title="Appellation du site" id="name">
                    <InputName />
                </FormParagraph>
            </section>

            <section class="h-96 bg-G500 lg:w-96 ml-4 my-3" v-if="address">
                <InputCoordinates />
            </section>
        </div>
    </FormSection>
</template>

<script setup>
import { findNearby } from "@/api/towns.api";
import { useFieldValue, useFormValues } from "vee-validate";
import { defineProps, ref, toRefs, watch } from "vue";

import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph, Link } from "@resorptionbidonvilles/ui";
// import InputAddress from "../inputs/FormDeclarationDeSiteInputAddress.vue";
import InputAddress from "@/components/InputAddress/InputAddress.vue";
import InputCoordinates from "../inputs/FormDeclarationDeSiteInputCoordinates.vue";
import InputName from "../inputs/FormDeclarationDeSiteInputName.vue";

const props = defineProps({
    townId: {
        type: Number,
        required: false,
        default: undefined,
    },
});
const { townId } = toRefs(props);
const values = useFormValues();
const address = useFieldValue("address");
// const address = ref(null);
console.log("Address: ", address.value);

const coordinates = useFieldValue("coordinates");
const nearbyShantytowns = ref([]);
watch(address, (val) => {
    console.log(val);
    console.log(address.value);
    console.log(values.value);

    nearbyShantytowns.value = [];
    if (!address.value?.data?.coordinates) {
        console.log("No coordinates");

        return;
    }
    // return;
    console.log("Check address", address.value);

    console.log("Setting coordinates", values.value);
    values.value.address = address.value;
    values.value.coordinates = address.value.data.coordinates;
    console.log("Nouvelles values: ", values.value);
});
// const handleAddress = (newAddress) => {
//     console.log(newAddress);

//     nearbyShantytowns.value = [];
//     if (!newAddress?.data?.coordinates) {
//         return;
//     }

//     values.value.coordinates = newAddress.data.coordinates;
// };
watch(coordinates, async () => {
    nearbyShantytowns.value = [];
    if (!coordinates.value) {
        return;
    }

    try {
        const { towns } = await findNearby(
            coordinates.value[0],
            coordinates.value[1]
        );
        nearbyShantytowns.value = townId.value
            ? towns.filter(({ id }) => id !== townId.value)
            : towns;
    } catch (e) {
        console.log("Failed fetching nearby shantytowns");
    }
});
</script>
