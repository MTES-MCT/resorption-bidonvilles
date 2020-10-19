<template>
    <div :class="`checkbox-${variant}`">
        <template v-if="variant === 'default'">
            <label :class="['inline-flex cursor-pointer', info ? 'items-start' : 'items-center']">
                <input type="checkbox" class="form-checkbox h-5 w-5" v-bind="$props" :checked="isChecked" @change="onChange">
                <div class="ml-2">
                    <div>{{label}}</div>
                    <div v-if="info" class="text-xs">{{info}}</div>
                </div>
            </label>
        </template>
        <template  v-if="variant === 'card'">
            <label :class="['inline-flex cursor-pointer border-2 rounded-md border-primary  px-4 py-3 hover:bg-primary hover:text-white', isChecked ? 'bg-primary text-white' : 'text-primary']">
                <input type="checkbox" class="appearance-none absolute invisible" v-bind="$props" :checked="isChecked" @change="onChange">
                <div>{{label}}</div>
            </label>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'Checkbox',
        props: {
            checkValue: {
                type: [String, Boolean, Number]
            },
            label: {
                type: String
            },
            value: {
                type: Array
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
            onChange: function(e) {
                let currentValue = [...this.value]
                if (e.target.checked) {
                    currentValue.push(this.checkValue)
                } else {
                    currentValue = currentValue.filter(item => item !== this.checkValue)
                }
                this.$emit('input', currentValue);
            }
        },
        computed: {
            isChecked() {
                return this.value && this.value.includes(this.checkValue)
            },
        }
    };
</script>
