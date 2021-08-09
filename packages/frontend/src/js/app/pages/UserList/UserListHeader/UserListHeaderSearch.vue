<template>
    <div class="flex items-center">
        <div class="relative w-128">
            <InputIcon
                class="text-primary pl-6"
                position="before"
                prefixIcon="search"
            />

            <input
                :class="[inputClasses, 'pl-12 pr-12 rounded-full shadow-sm']"
                :value="value"
                @input="$evt => $emit('input', $evt.currentTarget.value)"
                placeholder="Recherche..."
            />

            <InputIcon position="after" class="pr-6" v-if="value">
                <div @click="$emit('input', '')" class="cursor-pointer">
                    <Icon
                        class="text-primary text-display-sm"
                        icon="times"
                        data-cy-button="clear"
                    />
                </div>
            </InputIcon>
        </div>
        <Button class="rounded-full ml-2">Rechercher</Button>
    </div>
</template>
<script>
import getInputClasses from "#app/components/ui/Form/utils/getInputClasses";
import InputIcon from "#app/components/ui/Form/utils/InputIcon.vue";

export default {
    props: {
        value: {
            type: String
        }
    },
    components: {
        InputIcon
    },
    computed: {
        inputClasses() {
            return getInputClasses("default");
        }
    }
};
</script>
