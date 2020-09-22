<template>
    <div>
        <div>
            <Checkbox checkValue="a" label="a" v-model="checkboxValue" />
            <Checkbox checkValue="b" label="b" v-model="checkboxValue" />
            <Checkbox checkValue="c" label="c" v-model="checkboxValue" />
        </div>
        {{checkboxValue}}
    </div>
</template>

<script>
    export default {
        name: 'CheckboxExample',
        data() {
            return {
                checkboxValue: []
            }

        }
    }
</script>
