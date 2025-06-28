<template>
    <Field :id="id" :name="id" v-slot="{ field, errors }">
        <InputWrapper :hasErrors="!!errors.length">
            <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" :for="`rb-select-${id}`" />

            <div class="relative">
                <InputIcon position="before" :icon="prefixIcon" v-if="prefixIcon" />
                <DsfrInput isTextarea ref="input" :id="`rb-select-${id}`" :data-cy-field="cypressName" :disabled="isSubmitting || disabled"
                :readonly="isSubmitting || disabled" :class="['bg-white', classes]" v-bind="{ ...field, ...filteredProps }" v-model="currentValue" 
                @update:modelValue="(val) => { currentValue = val; $emit('input', val) }" @focus="onFocus" @blur="(e) => { onBlur(e); $emit('blur', e) }"/>
                <InputIcon position="after" :icon="suffixIcon" v-if="suffixIcon" />
            </div>
            <InputError>{{ errors[0] }}</InputError>
        </InputWrapper>
    </Field>
</template>

<script>
import { Field, useIsSubmitting } from "vee-validate";

import filteredProps from "./mixins/filteredProps";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

export default {
    name: "TextArea",
    mixins: [filteredProps],
    setup() {
        const isSubmitting = useIsSubmitting();
        return {
            isSubmitting,
        };
    },
    props: {
        label: {
            type: String
        },
        info: {
            type: String
        },
        placeholder: {
            type: String
        },
        type: {
            type: String,
            default: "text"
        },
        value: {
            type: String
        },
        rules: {
            type: String
        },
        validationName: {
            type: String
        },
        id: {
            type: String
        },
        variant: {
            type: String,
            default: "default"
        },
        prefixIcon: {
            type: String
        },
        suffixIcon: {
            type: String
        },
        rows: {
            type: [String, Number]
        },
        cols: {
            type: String
        },
        cypressName: {
            type: String
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isFocused: false,
        };
    },
    computed: {
        classes() {
            const inputOptions = {
                // error: !!this.errors?.length,
                prefixIcon: this.prefixIcon,
                suffixIcon: this.suffixIcon,
                disabled: this.disabled
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions)
            }[this.variant];
        }
    },
    methods: {
        onFocus() {
            this.isFocused = true;
        },
        onBlur() {
            this.isFocused = false;
        },
        focus() {
            this.$refs.textarea.focus();
        },
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputIcon,
        Field
    }
};
</script>
