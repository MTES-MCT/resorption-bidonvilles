<template>
    <div :class="[`checkbox-${variant}`, ...containerClasses]">
        <!-- Card Variant -->
        <CheckableCard v-if="variant === 'card'" :isChecked="isChecked">
            <input
                type="checkbox"
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
                type="checkbox"
                :class="checkboxClasses"
                v-bind="filteredProps"
                :checked="isChecked"
                @change="onChange"
            />
            <slot :isChecked="isChecked">
                <div class="ml-2">
                    <div>{{ label }}</div>
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
    name: "Checkbox",
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
            type: Array
        },
        info: {
            type: String
        },
        variant: {
            type: String,
            default: "default"
        }
    },
    methods: {
        onChange(e) {
            let currentValue = [...this.value];
            if (e.target.checked) {
                currentValue.push(this.checkValue);
            } else {
                currentValue = currentValue.filter(
                    item => item !== this.checkValue
                );
            }
            this.$emit("input", currentValue);
        }
    },
    computed: {
        isChecked() {
            return this.value && this.value.includes(this.checkValue);
        },
        checkboxClasses() {
            return {
                default: "form-checkbox h-5 w-5",
                invisible: "appearance-none absolute invisible"
            }[this.variant];
        }
    }
};
</script>
