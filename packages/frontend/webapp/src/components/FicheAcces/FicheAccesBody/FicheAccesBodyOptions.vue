<template>
    <div
        class="pt-2 pb-4 px-1 lg:px-4 bg-G300"
        v-if="optionList && optionList.length > 0"
    >
        <p class="font-bold">Options</p>
        <p class="ml-8">
            <Checkbox
                v-for="option in optionList"
                :key="option.id"
                :value="option.id"
                :label="option.label"
                name="options"
                variant="checkbox"
                direction="col"
                :disabled="
                    user.status === 'inactive' || user.status === 'refused'
                "
                :active="
                    user.status !== 'active' || accesStore.activatedOptions
                "
            />
            <DsfrButton
                v-if="isModified && accesStore.activatedOptions"
                label="Valider les modifications"
                class="mt-2"
                size="sm"
                @click="modifyOptions(user, values.options)"
            />
        </p>
    </div>
</template>

<script setup>
import { toRefs, computed, watch } from "vue";
import { Checkbox } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";
import { useInputsStore } from "@/stores/inputs.store";
import { useAccesStore } from "@/stores/acces.store";
import { useForm } from "vee-validate";
import modifyOptions from "../FicheAccesActions/actions/modifyOptions.action";

const inputStore = useInputsStore();
const accesStore = useAccesStore();
const props = defineProps({
    user: {
        type: Object,
        required: false,
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

const isModified = computed(() => {
    const opts = options.value || [];
    const vals = values.options || [];

    if (opts.length !== vals.length) {
        return true;
    }

    const uniqueOpts = new Set(opts);
    const uniqueVals = new Set(vals);

    if (uniqueOpts.size !== uniqueVals.size) {
        return true;
    }

    for (const val of uniqueOpts) {
        if (!uniqueVals.has(val)) {
            return true;
        }
    }

    return false;
});

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value?.role_id];
});

watch(values, () => {
    inputStore.handleOptions(values.options);
});

watch(options, () => {
    if (
        options.value &&
        values.options &&
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
