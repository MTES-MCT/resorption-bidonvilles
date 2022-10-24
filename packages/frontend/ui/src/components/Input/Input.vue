<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" />

        <div class="relative" :class="width">
            <InputIcon position="before" :icon="prefixIcon" v-if="prefixIcon" />
            <input :id="id" v-bind="filteredProps" :class="classes" :data-cy-field="cypressName" :step="step"
                :disabled="disabled" ref="input" @blur="$emit('blur', $event)" @change="setValue($refs.input.value)" />
            <InputIcon position="after" v-if="(clear && currentValue) || suffixIcon || $slots.suffix">
                <slot name="suffix">
                    <span v-if="clear" @click="$emit('clear')" class="cursor-pointer hover:text-G800 text-sm text-G500">
                        <Icon icon="fa-trash-alt fa-regular" />
                        Vider
                    </span>

                    <Icon :icon="suffixIcon" :spin="spinSuffixIcon" v-if="suffixIcon" />
                </slot>
            </InputIcon>
            <slot />
        </div>
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script>
import Icon from "../Icon.vue";
import filteredProps from "./mixins/filteredProps";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import getInputClasses from "./utils/getInputClasses";

export default {
    name: "RbTextInput",
    mixins: [filteredProps],
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
        step: {
            type: [String, Number], // For "number" inputs only
            default: 0
        },
        validationName: {
            type: String
        },
        rules: {
            type: String
        },
        value: {
            type: [String, Number]
        },
        id: {
            type: String
        },
        errors: {
            type: Array,
            default() {
                return [];
            }
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
        spinSuffixIcon: {
            type: Boolean,
            default: false
        },
        cypressName: {
            type: String
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        },
        width: {
            required: false,
            type: String,
            default: undefined
        },
        disabled: {
            type: Boolean
        },
        withoutMargin: {
            type: Boolean
        },
        clear: {
            type: Boolean,
            default: false
        },
        autocomplete: {
            type: String,
            required: false
        }
    },
    computed: {
        classes() {
            const inputOptions = {
                error: this.error,
                prefixIcon: this.prefixIcon,
                suffixIcon: this.suffixIcon
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions),
                filter: getInputClasses("filter", inputOptions)
            }[this.variant];
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputIcon,
        Icon
    },
    data() {
        return {
            currentValue: ""
        };
    },
    mounted() {
        this.currentValue = this.$refs.input?.value || "";
    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        blur() {
            this.$refs.input.blur();
        },
        setValue(str) {
            this.$refs.input.value = str;
            this.currentValue = str;
        }
    }
};
</script>
