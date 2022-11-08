<template>
    <CheckableGroup id="closing_solutions" :label="labels.closing_solutions">
        <div
            v-for="item in configStore.config.closing_solutions"
            :key="item.id"
        >
            <Checkbox
                :value="item.id"
                :label="item.label"
                name="closing_solutions"
                variant="checkbox"
                v-model="closingSolutions"
            />

            <div
                v-if="closingSolutions.includes(item.id)"
                class="my-3 bg-G200 p-3"
            >
                <div class="flex items-center justify-between space-x-3">
                    <span>Ménages</span>
                    <TextInput
                        :id="`closing_solution_details.${item.id}.householdsAffected`"
                        withoutMargin
                    />
                    <span class="pl-4">Personnes</span>
                    <TextInput
                        :id="`closing_solution_details.${item.id}.peopleAffected`"
                        withoutMargin
                    />
                </div>

                <p class="mt-2">Commentaire</p>
                <TextInput
                    :id="`closing_solution_details.${item.id}.message`"
                    placeholder="Saisissez ici toutes information complémentaire"
                    withoutMargin
                />
            </div>
        </div>
    </CheckableGroup>
</template>

<script setup>
import { ref } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Checkbox, TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FicheSiteModaleFermeture.labels";

const configStore = useConfigStore();
const closingSolutions = ref([]);
</script>
