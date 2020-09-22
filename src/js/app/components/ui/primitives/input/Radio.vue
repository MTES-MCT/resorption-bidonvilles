<template>
    <label class="inline-flex items-center">
        <input type="radio" class="form-checkbox h-5 w-5"  v-bind="$props" :checked="isChecked" @change="onChange"><span class="ml-2">{{label}}</span>
    </label>
</template>

<script>
    export default {
        name: 'Checkbox',
        props: ['checkValue','label','value'],
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
