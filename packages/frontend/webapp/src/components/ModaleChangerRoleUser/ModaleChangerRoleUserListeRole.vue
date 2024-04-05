<template>
    <p class="text-xl font-bold mb-4 pl-4">Nouveau rôle</p>
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
</template>
<script setup>
import { toRefs, defineEmits } from "vue";

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
