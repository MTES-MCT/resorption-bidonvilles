<template>
    <section>
        <p>
            Le nombre de personnes sur un site est mouvant, les données fournies
            par les acteurs - même des estimations - participent à
            l'amélioration de la connaissance.
        </p>

        <div class="mt-3 grid grid-cols-5">
            <p class="grid grid-cols-subgrid gap-2 col-span-5">
                <TextInput
                    width="w-32"
                    id="population_total"
                    name="population_total"
                    :label="labels.population_total"
                />
                <TextInput
                    width="w-32"
                    id="population_total_females"
                    name="population_total_females"
                    :label="labels.population_total_females"
                    class="col-span-2"
                />
                <TextInput
                    width="w-32"
                    id="population_couples"
                    name="population_couples"
                    :label="labels.population_couples"
                    class="col-start-4"
                />
            </p>
        </div>
        <p class="grid grid-cols-5 gap-4 col-span-5">
            <TextInput
                width="w-32"
                id="population_minors"
                name="population_minors"
                :label="labels.population_minors"
            />
            <TextInput
                width="w-32"
                id="population_minors_girls"
                name="population_minors_girls"
                :label="labels.population_minors_girls"
                class="col-span-2"
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
