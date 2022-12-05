<template>
    <section>
        <FicheAccesBodyMessage :user="user" />
        <FicheAccesBodyRole :user="user" />
        <FicheAccesBodyOptions :user="user" v-model:options="checkedOptions" />
        <FicheAccesBodyAdminComments :user="user" />
        <FicheAccesBodyWarning v-if="user.status === 'new'" />
    </section>
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import FicheAccesBodyMessage from "./FicheAccesBodyMessage.vue";
import FicheAccesBodyRole from "./FicheAccesBodyRole.vue";
import FicheAccesBodyOptions from "./FicheAccesBodyOptions.vue";
import FicheAccesBodyAdminComments from "./FicheAccesBodyAdminComments.vue";
import FicheAccesBodyWarning from "./FicheAccesBodyWarning.vue";

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
const checkedOptions = computed({
    get() {
        return options.value;
    },
    set(newValue) {
        emit("update:options", newValue);
    },
});
</script>
