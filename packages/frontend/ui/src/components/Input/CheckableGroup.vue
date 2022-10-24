<template>
    <InputWrapper
        :withoutMargin="withoutMargin"
        :hasErrors="errors[id] && errors[id].length > 0"
        :id="id"
    >
        <InputLabel
            :label="label"
            :info="info"
            :showMandatoryStar="showMandatoryStar"
        />

        <div
            class="checkableGroup"
            :class="[
                'flex',
                direction === 'vertical'
                    ? 'flex-col checkableGroup--verticalLayout items-start vertical'
                    : 'flex-row flex-wrap checkableGroup--horizontalLayout horizontal'
            ]"
        >
            <slot />
        </div>
        <InputError>
            <ErrorMessage :name="id" />
        </InputError>
    </InputWrapper>
</template>

<style lang="scss">
.checkableGroup.vertical > * {
    @apply mb-1;
}

.checkableGroup.horizontal > * {
    @apply mr-1 mb-1;
}
</style>

<script>
import { useFormErrors, ErrorMessage } from "vee-validate";
import InputError from "./utils/InputError.vue";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";

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
        ErrorMessage
    }
};
</script>