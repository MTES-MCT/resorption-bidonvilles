<template>
    <InputWrapper>
        <InputLabel :label="label" :info="info" />
        <ValidationProvider
            ref="provider"
            :rules="rules"
            :name="validationName || label"
            v-slot="{ errors }"
            :vid="id"
        >
            <component
                :is="dynamicComponent"
                :input-class="inputClasses"
                v-bind="$attrs"
                v-on="$listeners"
                :language="dateLanguage"
                :monday-first="true"
            ></component>
            <InputError>{{ errors[0] }}</InputError>
        </ValidationProvider>
    </InputWrapper>
</template>

<script>
import { fr } from "vuejs-datepicker/dist/locale";
import getInputClasses from "./Form/utils/getInputClasses";
import InputLabel from "./Form/utils/InputLabel.vue";
import InputWrapper from "./Form/utils/InputWrapper.vue";
import InputInfo from "./Form/utils/InputInfo.vue";
import InputError from "./Form/utils/InputError.vue";

export default {
    props: {
        label: {
            type: String
        },
        info: {
            type: String
        },
        id: {
            type: String
        },
        validationName: {
            type: String
        },
        variant: {
            type: String,
            default: "default"
        },
        rules: {
            type: String
        }
    },
    components: {
        InputLabel,
        InputWrapper,
        InputError,
        InputInfo
    },
    data() {
        return {
            dateLanguage: fr,
            dynamicComponent: null
        };
    },
    mounted() {
        // Make vuejs-datepicker friendly with SSR
        import("vuejs-datepicker").then(module => {
            this.dynamicComponent = module.default;
        });
    },
    computed: {
        inputClasses() {
            const inputOptions = { error: this.error };

            return {
                state: [...getInputClasses("state", inputOptions)],
                default: getInputClasses("default", inputOptions)
            }[this.variant];
        }
    }
};
</script>
