<template>
    <label :class="['inline-flex cursor-pointer', info ? 'items-start' : 'items-center']">
        <input type="checkbox" class="form-checkbox h-5 w-5" v-bind="$props" :checked="isChecked" @change="onChange">
        <div class="ml-2">
            <div>{{label}}</div>
            <div v-if="info" class="text-xs">{{info}}</div>
        </div>
    </label>
</template>

<script>
    export default {
        name: 'Checkbox',
        props: ['checkValue','label','value', 'info'],
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
            }
        }
    };
</script>
