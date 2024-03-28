<template>
    <div class="pt-2 pb-4 px-1 lg:px-4 bg-G300" v-if="optionList.length > 0">
        <p class="font-bold">
            Options
            <Warning v-if="user.status !== 'new'" class="font-normal text-sm"
                >Les options de cet utilisateur ne peuvent pas être modifiées
                car son accès est déjà actif. En cas de besoin, veuillez nous
                contacter.</Warning
            >
        </p>
        <p class="ml-8">
            <Checkbox
                v-for="option in optionList"
                :key="option.id"
                :value="option.id"
                :label="option.label"
                name="options"
                variant="checkbox"
                direction="col"
                :disabled="user.status === 'inactive'"
                :active="user.status !== 'active'"
            />
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, watch } from "vue";
import { Checkbox, Warning } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";
import { useInputsStore } from "@/stores/inputs.store";
import { useForm } from "vee-validate";

const inputStore = useInputsStore();
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
});
const { user, options } = toRefs(props);

const { values, setFieldValue } = useForm({
    initialValues: {
        options: options.value || [],
    },
});

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value.role_id];
});

watch(values, () => {
    inputStore.handleOptions(values.options);
});
watch(options, () => {
    if (
        options.value.length === values.options.length &&
        options.value.every((v) => values.options.includes(v))
    ) {
        return;
    }
    setFieldValue("options", options.value);
});

const optionList = computed(() => {
    return accessPermission.value?.options || [];
});
</script>
