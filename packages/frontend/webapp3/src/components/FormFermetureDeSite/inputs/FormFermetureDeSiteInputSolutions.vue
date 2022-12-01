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
                v-model="solutions"
                v-bind="$attrs"
            />

            <div v-if="solutions.includes(item.id)" class="my-3 bg-G200 p-3">
                <div class="flex items-center justify-between space-x-3">
                    <span>Ménages</span>
                    <TextInput
                        :id="`solution_details.${item.id}.householdsAffected`"
                        v-bind="$attrs"
                        v-model="details[`${item.id}_householdsAffected`]"
                        withoutMargin
                    />
                    <span class="pl-4">Personnes</span>
                    <TextInput
                        :id="`solution_details.${item.id}.peopleAffected`"
                        v-bind="$attrs"
                        v-model="details[`${item.id}_peopleAffected`]"
                        withoutMargin
                    />
                </div>

                <p class="mt-2">Commentaire</p>
                <TextInput
                    :id="`solution_details.${item.id}.message`"
                    placeholder="Saisissez ici toutes information complémentaire"
                    v-bind="$attrs"
                    v-model="details[`${item.id}_message`]"
                    withoutMargin
                />
            </div>
        </div>
    </CheckableGroup>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Checkbox, TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    defaultValue: Array,
});
const { defaultValue } = toRefs(props);
const configStore = useConfigStore();

const solutions = ref(defaultValue.value.map(({ id }) => id));
const details = ref(
    defaultValue.value.reduce(
        (acc, { id, householdsAffected, peopleAffected, message }) => {
            acc[`${id}_householdsAffected`] = householdsAffected;
            acc[`${id}_peopleAffected`] = peopleAffected;
            acc[`${id}_message`] = message;
            return acc;
        },
        {}
    )
);
</script>
