<template>
    <Autocomplete
        v-bind="$attrs"
        name="users"
        :fn="autocompleteFn"
        v-model="target"
        ref="input"
    />
    <TagList :tags="tags" :onDelete="removeTarget" :disabled="isSubmitting" />
</template>

<script setup>
import { defineProps, toRefs, ref, watch, computed, nextTick } from "vue";
import { useIsSubmitting, useField } from "vee-validate";
import { autocomplete } from "@/api/organizations.api.js";

import { Autocomplete, TagList } from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: String,
    departement: {
        type: String,
        required: false,
    },
    value: {
        type: Object,
        required: false,
        default() {
            return {
                users: [],
                organizations: [],
            };
        },
    },
});
const target = ref(null);
const input = ref(null);
const { name, departement, value: defaultValue } = toRefs(props);

const { value } = useField(name.value, undefined, {
    initialValue: defaultValue,
});
const isSubmitting = useIsSubmitting();

async function autocompleteFn(search) {
    const results = await autocomplete(search, departement.value);
    return results
        .map((item) => {
            return {
                ...item,
                category: item.type.label,
                data: {
                    id: item.id,
                    label: item.label,
                    type: item.type.id,
                },
            };
        })
        .filter(unusedTarget);
}

const tags = computed(() => {
    return [
        ...value.value.organizations.map(({ id, label }) => ({
            id: `organization.${id}`,
            label,
        })),
        ...value.value.users.map(({ id, label }) => ({
            id: `user.${id}`,
            label,
        })),
    ];
});

function unusedTarget(target) {
    const { data } = target;
    return !value.value[`${data.type}s`].map(({ id }) => id).includes(data.id);
}

function removeTarget(target) {
    const [type, id] = target.split(".");
    const index = value.value[`${type}s`].findIndex((item) => item.id === id);
    value.value[`${type}s`].splice(index, 1);
}

watch(target, () => {
    if (!target.value) {
        return;
    }

    const { id, label, type } = target.value.data;
    value.value[`${type}s`].push({
        id,
        label,
    });
    input.value.clear();
    nextTick(input.value.focus);
});
</script>
