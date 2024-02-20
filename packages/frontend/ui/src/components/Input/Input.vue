<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <InputLabel :label="label" :info="info" :showMandatoryStar="showMandatoryStar" :for="id" />

        <div class="relative" :class="width ">
            <InputIcon position="before" :icon="prefixIcon" v-if="prefixIcon" />
            <input :id="id" v-bind="filteredProps" :class="classes" :data-cy-field="cypressName" :step="step"
                :disabled="disabled" ref="input" @blur="$emit('blur', $event)" @change="setValue($refs.input.value)" />
            <InputIcon position="after" v-if="(clear && currentValue) || suffixIcon || $slots.suffix">
                <slot name="suffix" v-if="$slots.suffix" />
                <template v-else>
                    <span v-if="clear" @click="$emit('clear')" class="cursor-pointer hover:text-G800 text-sm text-G500">
                        <Icon icon="fa-trash-alt fa-regular" />
                        Vider
                    </span>

                    <Icon :icon="suffixIcon" :spin="spinSuffixIcon" v-if="suffixIcon" />
                </template>
            </InputIcon>
            <slot />
            <ToolTip v-if="inlineError && errors.length" :tip="errors[0]"
                class="inline-block ml-2 text-red text-sm cursor-pointer">
                <Icon icon="triangle-exclamation" /> Voir l'erreur
            </ToolTip>
        </div>
        <InputError v-if="!inlineError && errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script>
import Icon from "../Icon.vue";
import filteredProps from "./mixins/filteredProps";
import InputLabel from "./utils/InputLabel.vue";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import InputIcon from "./utils/InputIcon.vue";
import ToolTip from "../ToolTip.vue";
import getInputClasses from "./utils/getInputClasses";

export default {
    name: "RbTextInput",
    mixins: [filteredProps],
    props: {
        defaultValue: {
            type: String,
            required: false,
            default: "",
        },
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
        },
        size: {
            type: String,
            required: false,
            default: "md"
        },
        inlineError: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        classes() {
            const inputOptions = {
                error: !!this.errors.length,
                prefixIcon: this.prefixIcon,
                suffixIcon: this.suffixIcon,
                clear: this.clear,
                size: this.size,
                disabled: this.disabled,
            };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions),
                filter: getInputClasses("filter", inputOptions),
                minimal: getInputClasses("minimal", inputOptions),
            }[this.variant];
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputIcon,
        Icon,
        ToolTip,
    },
    data() {
        return {
            currentValue: this.defaultValue,
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
        setValue(str, silentMode = false) {
            this.$refs.input.value = str;
            this.currentValue = str;

            if (silentMode !== true) {
                this.$emit('changed', this.currentValue);
            }
        }
    }
};
</script>
