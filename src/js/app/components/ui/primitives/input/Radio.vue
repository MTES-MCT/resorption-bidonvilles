<template >
    <div :class="`radio-${variant}`">
        <template v-if="variant === 'default'">
            <label :class="['inline-flex items-center']">
                <input type="radio" class="form-checkbox h-5 w-5"  v-bind="$props" :checked="isChecked" @change="onChange"><span class="ml-2">{{label}}</span>
            </label>
        </template>
        <template v-if="variant === 'card'">
            <label :class="['inline-flex cursor-pointer border-2 rounded-md border-primary px-4 py-3 hover:bg-primary hover:text-white', isChecked ? 'bg-primary text-white' : 'text-primary']">
                <input type="radio" class="appearance-none hidden" v-bind="$props" :checked="isChecked" @change="onChange">
                <div>{{label}}</div>
            </label>
        </template>
    </div>
</template>



<script>
    export default {
        name: 'Radio',
        props: {
            checkValue: {
                type: [String, Boolean, Number]
            },
            label: {
                type: String
            },
            value: {
                type: [String, Boolean, Number]
            },
            info: {
                type: String
            },
            variant: {
                type: String,
                default: 'default'
            }
        },
        methods: {
            onChange: function() {
                this.$emit('input', this.checkValue);
            }
        },
        computed: {
            isChecked() {
                return this.value === this.checkValue
            }
        }
    };
</script>
