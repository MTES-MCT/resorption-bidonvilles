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
                <InputIcon position="before" :icon="icon" />
                <select
                    :class="classes"
                    @change="$emit('input', $event.target.value)"
                    :id="id"
                    v-bind="filteredProps"
                >
                    <slot />
                </select>
                <InputIcon position="after" icon="chevron-down" />
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
    name: "Select",
    mixins: [filteredProps],
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
        value: {
            type: String
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
        variant: {
            type: String,
            default: "default"
        },
        icon: {
            type: String
        }
    },
    computed: {
        classes() {
            const inputOptions = {
                error: this.error,
                prefixIcon: this.icon,
                suffixIcon: true
            };

            return {
                state: [
                    "appearance-none",
                    ...getInputClasses("state", inputOptions)
                ],
                default: [
                    "appearance-none",
                    ...getInputClasses("default", inputOptions)
                ]
            }[this.variant];
        }
    },
    components: {
        InputWrapper,
        InputLabel,
        InputError,
        InputIcon
    }
};
</script>
