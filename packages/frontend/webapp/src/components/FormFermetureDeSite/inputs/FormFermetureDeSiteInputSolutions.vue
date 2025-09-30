<template>
    <DsfrCheckboxSet
        name="solutions"
        id="solutions"
        :errorMessage="errors ? errors : ''"
        small
    >
        <template #legend>
            <span class="font-bold">{{ labels.solutions }}</span>
        </template>
        <template #default>
            <div
                v-for="item in configStore.config.closing_solutions"
                :key="item.id"
                class="flex flex-col flex-wrap w-full md:w-4/6"
            >
                <DsfrCheckbox
                    :value="item.id"
                    :label="item.label"
                    name="solutions"
                    :id="`solution_${item.id}`"
                    variant="checkbox"
                    v-model="values.solutions"
                    small
                />
                <div
                    v-if="values.solutions.includes(item.id)"
                    class="ml-8 mb-3 bg-blue100 p-3 rounded-sm border-2 border-G200"
                >
                    <div class="flex items-center justify-between space-x-3">
                        <span>Ménages</span>
                        <DsfrInput
                            :id="`solution_details.${item.id}.householdsAffected`"
                            :name="`solution_details.${item.id}.householdsAffected`"
                            v-model="
                                values.solution_details[item.id]
                                    .householdsAffected
                            "
                            withoutMargin
                        />
                        <span class="pl-4">Personnes</span>
                        <DsfrInput
                            :id="`solution_details.${item.id}.peopleAffected`"
                            :name="`solution_details.${item.id}.peopleAffected`"
                            v-model="
                                values.solution_details[item.id].peopleAffected
                            "
                            :class="{ 'border-red500 bg-red200': error }"
                            withoutMargin
                        />
                    </div>

                    <p class="mt-2">Commentaire</p>
                    <DsfrInput
                        :id="`solution_details.${item.id}.message`"
                        :name="`solution_details.${item.id}.message`"
                        placeholder="Saisissez ici toute information complémentaire"
                        v-model="values.solution_details[item.id].message"
                        withoutMargin
                        isTextarea
                    />
                </div>
            </div>
        </template>
    </DsfrCheckboxSet>
</template>

<script setup>
import { watch, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    errors: {
        type: Array,
        required: false,
        default: () => [],
    },
});

const { errors } = toRefs(props);

const emit = defineEmits(["update:solutions"]);
const configStore = useConfigStore();
const values = useFormValues();

// Proxy afin d'éviter l'erreur liée au chargement d'une valeur pas encore créée
const ensureDetail = (id) => {
    if (!values.value.solution_details[id]) {
        values.value.solution_details[id] = {
            householdsAffected: "",
            peopleAffected: "",
            message: "",
        };
    }
};

watch(
    () => [...values.value.solutions],
    (next, prev = []) => {
        const added = next.filter((id) => !prev.includes(id));
        const removed = prev.filter((id) => !next.includes(id));
        added.forEach(ensureDetail);
        removed.forEach((id) => {
            delete values.value.solution_details[id];
        });
    },
    { immediate: true }
);

watch(
    () => values.value.solution_details,
    (newValue) => {
        emit("update:solutions", newValue);
    },
    { deep: true }
);
</script>
