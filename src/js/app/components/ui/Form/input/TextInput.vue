<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider
            :rules="rules"
            :name="validationName || label"
            v-slot="{ errors }"
            :vid="id"
        >
            <div class="relative">
                <InputIcon
                    position="before"
                    :icon="prefixIcon"
                    v-if="prefixIcon"
                />
                <input
                    :id="id"
                    @input="$emit('input', $event.target.value)"
                    v-bind="filteredProps"
                    :class="classes"
                />
                <InputIcon
                    position="after"
                    :icon="suffixIcon"
                    v-if="suffixIcon"
                />
            </div>
            <InputError>{{ errors[0] }}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
import filteredProps from "../../mixins/filteredProps";
import InputLabel from "../utils/InputLabel.vue";
import InputWrapper from "../utils/InputWrapper.vue";
import InputError from "../utils/InputError.vue";
import InputIcon from "../utils/InputIcon.vue";
import getInputClasses from "../utils/getInputClasses";

export default {
    name: "TextInput",
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
        validationName: {
            type: String
        },
        rules: {
            type: String
        },
        value: {
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
                default: getInputClasses("default", inputOptions)
            }[this.variant];
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputIcon
    }
};
</script>
