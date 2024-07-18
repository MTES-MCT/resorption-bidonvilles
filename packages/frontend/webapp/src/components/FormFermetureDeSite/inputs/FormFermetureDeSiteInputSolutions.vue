<template>
    <CheckableGroup id="solutions" :label="labels.solutions">
        <div
            v-for="item in configStore.config.closing_solutions"
            :key="item.id"
        >
            <Checkbox
                :value="item.id"
                :label="item.label"
                name="solutions"
                variant="checkbox"
                v-bind="$attrs"
                v-model="values.solutions"
            />

            <div
                v-if="values.solutions.includes(item.id)"
                class="my-3 bg-G200 p-3"
            >
                <div class="flex items-center justify-between space-x-3">
                    <span>Ménages</span>
                    <TextInput
                        :id="`solution_details.${item.id}.householdsAffected`"
                        :name="`solution_details.${item.id}.householdsAffected`"
                        v-bind="$attrs"
                        withoutMargin
                    />
                    <span class="pl-4">Personnes</span>
                    <TextInput
                        :id="`solution_details.${item.id}.peopleAffected`"
                        :name="`solution_details.${item.id}.peopleAffected`"
                        :class="{ 'border-red500 bg-red200': error }"
                        v-bind="$attrs"
                        withoutMargin
                    />
                </div>

                <p class="mt-2">Commentaire</p>
                <TextInput
                    :id="`solution_details.${item.id}.message`"
                    :name="`solution_details.${item.id}.message`"
                    placeholder="Saisissez ici toute information complémentaire"
                    v-bind="$attrs"
                    withoutMargin
                />
            </div>
        </div>
    </CheckableGroup>
</template>

<script setup>
import { defineEmits, watch } from "vue";
import { useFormValues } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Checkbox, TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormFermetureDeSite.labels";

const emit = defineEmits(["update:solutions"]);
const configStore = useConfigStore();
const values = useFormValues();

watch(
    () => values.value.solution_details,
    (newValue) => {
        emit("update:solutions", newValue);
    },
    { deep: true }
);
</script>
