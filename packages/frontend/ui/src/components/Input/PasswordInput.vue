<template>
    <div class="relative">
        <TextInput
            :type="this.hidden ? 'password' : 'text'"
            v-bind="$attrs"
            @input="$emit('input', $event)"
        />
        <div class="eyeButton">
            <Button
                :icon="hidden ? 'eye-slash' : 'eye'"
                type="button"
                variant="primaryText"
                @click="toggleHidden"
            />
        </div>
    </div>
</template>

<script>
import TextInput from "./TextInput.vue";
import Button from "../Button.vue"
export default {
    data() {
        return {
            hidden: true
        };
    },
    components: {
        TextInput,
        Button
    },
    methods: {
        toggleHidden() {
            this.hidden = !this.hidden;
        }
    }
};
</script>

<style>
.eyeButton {
    position: absolute;
    top: 24px;
    right: 8px;
}
</style>
