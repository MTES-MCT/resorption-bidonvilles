<template>
    <label class="inline-flex items-center">
        <input type="checkbox" class="form-checkbox h-5 w-5" v-bind="$props" :checked="isChecked" @change="onChange"><span class="ml-2">{{label}}</span>
    </label>
</template>

<script>
    export default {
        name: 'Checkbox',
        props: ['checkValue','label','value'],
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
                return this.value.includes(this.checkValue)
            }
        }
    };
</script>
