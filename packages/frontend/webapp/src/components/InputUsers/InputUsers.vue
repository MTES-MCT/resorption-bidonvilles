<template>
    <InputWrapper :hasErrors="!!errors.length">
        <Autocomplete
            :id="name"
            v-bind="$attrs"
            :name="`users-${name}`"
            :fn="autocompleteFn"
            v-model="target"
            ref="input"
            showCategory
        />
        <TagList
            :tags="tags"
            :onDelete="removeTarget"
            :disabled="isSubmitting"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { defineProps, toRefs, ref, watch, computed, nextTick } from "vue";
import { useIsSubmitting, useField } from "vee-validate";
import { autocomplete } from "@/api/organizations.api.js";

import {
    Autocomplete,
    TagList,
    InputWrapper,
    InputError,
} from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: String,
    departement: {
        type: String,
        required: false,
    },
    usersOnly: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const target = ref(null);
const input = ref(null);
const { name, departement, usersOnly } = toRefs(props);

const { value, errors } = useField(name.value);
const isSubmitting = useIsSubmitting();

async function autocompleteFn(search) {
    const results = await autocomplete(
        search,
        departement.value,
        usersOnly.value === true ? "1" : "0"
    );
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
    const index = value.value[`${type}s`].findIndex(
        (item) => `${item.id}` === `${id}`
    );
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
