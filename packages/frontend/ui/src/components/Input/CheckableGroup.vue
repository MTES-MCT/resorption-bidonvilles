<template>
    <InputWrapper :withoutMargin="withoutMargin" :hasErrors="errors[id] && errors[id].length > 0" :id="id">
        <fieldset>
            <div class="flex items-center space-x-1">
                <Icon :icon="icon" v-if="icon" />
                <legend>
                    <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />
                </legend>
            </div>

            <div class="checkableGroup" :class="[
                'flex',
                direction === 'vertical'
                    ? 'flex-col checkableGroup--verticalLayout items-start vertical'
                    : 'flex-row flex-wrap checkableGroup--horizontalLayout horizontal'
            ]">
                <slot />
            </div>
            <InputError v-if="(errors[id] && errors[id].length > 0)">
                <ErrorMessage :name="id" />
            </InputError>
        </fieldset>
    </InputWrapper>
</template>

<style lang="scss">
.checkableGroup.vertical>* {
    @apply mb-1;
}

.checkableGroup.horizontal>* {
    @apply mr-1 mb-1;
}
</style>

<script>
import { useFormErrors, ErrorMessage, useFieldError } from "vee-validate";
import InputError from "./utils/InputError.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import Icon from "../Icon.vue";

export default {
    props: {
        label: {
            type: String
        },
        info: {
            type: String
        },
        error: {
            type: String
        },
        direction: {
            type: String,
            default: "vertical"
        },
        validationName: {
            type: String
        },
        rules: {
            type: String
        },
        id: {
            type: String
        },
        icon: {
            type: String,
            required: false,
            default: ""
        },
        withoutMargin: {
            required: false,
            type: Boolean,
            default: false
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    setup() {
        const errors = useFormErrors();

        return {
            errors
        };
    },
    components: {
        InputError,
        InputLabel,
        InputWrapper,
        ErrorMessage,
        Icon,
    }
};
</script>