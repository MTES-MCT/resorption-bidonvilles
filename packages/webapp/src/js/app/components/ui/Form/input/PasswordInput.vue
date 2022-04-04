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
export default {
    data() {
        return {
            hidden: true
        };
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
