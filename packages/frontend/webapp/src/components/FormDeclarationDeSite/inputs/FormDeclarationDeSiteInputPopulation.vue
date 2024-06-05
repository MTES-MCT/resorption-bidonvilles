<template>
    <section>
        <p>
            Le nombre de personnes sur un site est mouvant, les données fournies
            par les acteurs - même des estimations - participent à
            l'amélioration de la connaissance.
        </p>

        <p class="mt-3 flex flex-wrap gap-x-5">
            <TextInput
                width="w-32"
                id="population_total"
                name="population_total"
                :label="labels.population_total"
            />
            <TextInput
                width="w-32"
                id="population_couples"
                name="population_couples"
                :label="labels.population_couples"
            />
            <TextInput
                width="w-32"
                id="population_minors"
                name="population_minors"
                :label="labels.population_minors"
            />
        </p>

        <p class="flex flex-wrap gap-x-5">
            <TextInput
                width="w-32"
                id="population_minors_0_3"
                name="population_minors_0_3"
                :label="labels.population_minors_0_3"
            />
            <TextInput
                width="w-32"
                id="population_minors_3_6"
                name="population_minors_3_6"
                :label="labels.population_minors_3_6"
            />
            <TextInput
                width="w-32"
                id="population_minors_6_12"
                name="population_minors_6_12"
                :label="labels.population_minors_6_12"
            />
            <TextInput
                width="w-32"
                id="population_minors_12_16"
                name="population_minors_12_16"
                :label="labels.population_minors_12_16"
            />
            <TextInput
                width="w-32"
                id="population_minors_16_18"
                name="population_minors_16_18"
                :label="labels.population_minors_16_18"
            />
        </p>

        <p class="flex space-x-5">
            <TextInput
                width="w-32"
                id="minors_in_school"
                name="minors_in_school"
                :label="labels.minors_in_school"
            />
        </p>
    </section>
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
