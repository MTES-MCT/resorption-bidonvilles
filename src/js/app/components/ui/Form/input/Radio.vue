<template>
    <div :class="[`radio-${variant}`, ...containerClasses]">
        <!-- Card Variant -->
        <CheckableCard
            v-if="variant === 'card' || variant === 'townCard'"
            :variant="variant"
            :isChecked="isChecked"
            :data-cy-field="cypressName"
            :data-cy-label="label"
            :data-cy-checked="`${isChecked}`"
        >
            <input
                :type="type"
                class="appearance-none absolute invisible"
                v-bind="filteredProps"
                :checked="isChecked"
                @change="onChange"
            />
            <div>{{ label }}</div>
        </CheckableCard>

        <!-- Other Variants -->
        <label
            v-else
            :class="[
                'inline-flex cursor-pointer',
                info ? 'items-start' : 'items-center',
                ...labelClasses
            ]"
        >
            <input
                :type="type"
                :class="radioClasses"
                v-bind="filteredProps"
                :checked="isChecked"
                :data-cy-field="cypressName"
                :data-cy-label="label"
                :data-cy-checked="`${isChecked}`"
                @change="onChange"
            />
            <slot :isChecked="isChecked">
                <div class="ml-2">
                    <div class="text-sm">{{ label }}</div>
                    <div v-if="info" class="text-xs">{{ info }}</div>
                </div>
            </slot>
        </label>
    </div>
</template>

<script>
import filteredProps from "../../mixins/filteredProps";
import CheckableCard from "../utils/CheckableCard.vue";

export default {
    name: "Radio",
    mixins: [filteredProps],
    components: { CheckableCard },
    props: {
        checkValue: {
            type: [String, Boolean, Number]
        },
        label: {
            type: String
        },
        containerClasses: {
            type: [Array, String]
        },
        labelClasses: {
            type: [Array, String]
        },
        value: {
            type: [String, Boolean, Number]
        },
        info: {
            type: String
        },
        variant: {
            type: String,
            default: "default"
        },
        cypressName: {
            type: String
        },
        // We sometimes want a fake radio (resettable when we reclick on it)
        type: {
            type: String,
            default: "radio"
        }
    },
    methods: {
        onChange(e) {
            if (this.type === "checkbox") {
                this.$emit("input", e.target.checked ? this.checkValue : null);
            } else {
                this.$emit("input", this.checkValue);
            }
        }
    },
    computed: {
        isChecked() {
            return this.value === this.checkValue;
        },
        radioClasses() {
            return {
                classic: "form-checkbox h-5 w-5",
                invisible: "appearance-none absolute invisible",
                default: "radio-town-input"
            }[this.variant];
        }
    }
};
</script>

<!-- Custom checkbox style -->
<style>
.radio-town-input {
    @apply w-5 h-5 appearance-none border-2 border-G200 relative outline-none cursor-pointer rounded-full;
}

.radio-town-input:checked {
    @apply bg-primary;
    background-image: url(./assets/check-solid.svg);
    background-repeat: no-repeat;
    border: inset 4px transparent;
    box-sizing: border-box;
}
</style>
