<template>
    <div class="relative">
        <TextInput :type="this.hidden ? 'password' : 'text'" v-bind="$attrs" @input="$emit('input', $event)">
            <template v-slot:suffix>
                <Icon class="absolute right-8 cursor-pointer"
                    :icon="hidden ? 'fa-eye-slash fa-regular' : 'fa-eye fa-regular'" tabindex="0" :aria-label="hidden ? 'Valider pour afficher le mot de passe'
                        : 'Valider pour masquer le mot de passe'" @click="toggleHidden" @keyup.enter="toggleHidden" />
            </template>
        </TextInput>
    </div>
</template>

<script>
import TextInput from "./TextInput.vue";
import Icon from "../Icon.vue";

export default {
    data() {
        return {
            hidden: true
        };
    },
    components: {
        TextInput,
        Icon
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
