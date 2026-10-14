<template>
    <fieldset class="fieldset-reset">
        <legend class="text-xl font-bold mb-4 pl-4">Nouveau rôle</legend>
        <ul class="mb-4 pl-12">
            <li v-for="role in options" :key="role.id">
                <label :for="role.id">
                    <input
                        type="radio"
                        :id="role.id"
                        :value="role.id"
                        name="userRole"
                        @click="updateRole"
                    />
                    {{ role.name }}
                </label>
            </li>
        </ul>
    </fieldset>
</template>
<script setup>
import { toRefs } from "vue";

const props = defineProps({
    options: Array,
    model: String,
});
const { options } = toRefs(props);
const emit = defineEmits(["update-role"]);

function updateRole(event) {
    emit("update-role", event.target.value);
}
</script>

<style scoped>
.fieldset-reset {
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
}
</style>
