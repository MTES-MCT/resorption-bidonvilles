<template>
    <div class="py-6 px-8 bg-G300" v-if="optionList.length > 0">
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
                v-model="checkedOptions"
                :value="option.id"
                :label="option.label"
                name="options"
                variant="checkbox"
                direction="col"
                :disabled="user.status !== 'new'"
            />
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { Checkbox, Warning } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";

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
const emit = defineEmits(["update:options"]);

const accessPermission = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.permissions_description[user.value.role_id];
});

const checkedOptions = computed({
    get() {
        return options.value;
    },
    set(newValue) {
        emit("update:options", newValue);
    },
});
const optionList = computed(() => {
    return accessPermission.value?.options || [];
});
</script>
