<template>
    <ValidationProvider
        :rules="rules"
        :name="validationName || label"
        v-slot="{ errors }"
        :vid="id"
    >
        <InputWrapper :hasErrors="errors.length">
            <InputLabel :label="label" :info="info" />

            <div :class="'flex flex-col relative'">
                <div v-if="error" class="absolute h-full bg-error leftBorder" />
                <div
                    :class="[
                        'flex',
                        direction === 'vertical'
                            ? 'flex-col checkableGroup--verticalLayout'
                            : 'flex-row flex-wrap checkableGroup--horizontalLayout'
                    ]"
                >
                    <slot />
                </div>
            </div>
            <InputError>{{ errors[0] }}</InputError>
        </InputWrapper>
    </ValidationProvider>
</template>

<script>
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
        }
    },
    components: {
        InputError,
        InputLabel,
        InputWrapper
    }
};
</script>

<style scoped>
.leftBorder {
    width: 2px;
    left: -16px;
}
</style>

<style lang="scss">
.checkableGroup--horizontalLayout {
    .checkbox-card,
    .radio-card {
        @apply mr-1 mb-1;

        &:last-child {
            @apply mr-0;
        }
    }

    .checkbox-default,
    .radio-default {
        &:last-child {
            @apply mr-0 mb-0;
        }

        @apply mr-4 mb-2;
    }
}

.checkableGroup--verticalLayout {
    .radio-card {
        &:last-child {
            @apply mb-0;
        }

        @apply mb-6;
    }

    .checkbox-card,
    .radio-card {
        @apply mb-2;
    }
}
</style>
