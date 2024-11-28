<template>
    <FormSection id="adresse" variant="blue">
        <template v-slot:title>Localisation</template>
        <div class="flex flex-col lg:flex-row">
            <section class="flex-1">
                <FormParagraph
                    title="Adresse"
                    showMandatoryStar
                    id="addressParagraph"
                >
                    <InputAddress
                        v-model="values.address"
                        :disabled="isSubmitting"
                    />
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

                <FormParagraph title="Coordonnées GPS" id="coordinates">
                    <div class="flex flex-col gap-2">
                        <div>
                            <p><b>Latitude</b>: {{ coordinates[0] }}</p>
                            <p><b>Longitude</b>: {{ coordinates[1] }}</p>
                        </div>
                        <div
                            v-if="initialCoordinates !== coordinates"
                            class="text-redA11Y text-sm"
                        >
                            <Icon class="text-sm" icon="triangle-exclamation" />
                            Vous avez déplacé le marqueur de l'emplacement du
                            site. N'oubliez pas de cliquer sur "Mettre à jour"
                            pour valider ce changement
                        </div>
                    </div>
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
import { useFieldValue, useFormValues, useIsSubmitting } from "vee-validate";
import { defineProps, ref, toRefs, watch } from "vue";

import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph, Link, Icon } from "@resorptionbidonvilles/ui";
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
const coordinates = useFieldValue("coordinates");
const nearbyShantytowns = ref([]);
const initialCoordinates = ref(coordinates.value);
const isSubmitting = useIsSubmitting();

watch(address, () => {
    nearbyShantytowns.value = [];
    if (!address.value?.data?.coordinates) {
        return;
    }
    values.value.address = address.value;
    values.value.coordinates = address.value.data.coordinates;
});

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
