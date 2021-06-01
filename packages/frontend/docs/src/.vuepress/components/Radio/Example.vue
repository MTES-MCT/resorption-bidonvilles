<template>
    <div>
        <div>
            <Radio checkValue="a" label="a" v-model="radioValue" />
            <Radio checkValue="b" label="b" v-model="radioValue" />
            <Radio checkValue="c" label="c" v-model="radioValue" />
        </div>
        {{radioValue}}
    </div>
</template>

<script>
    export default {
        name: 'RadioExample',
        data() {
            return {
                radioValue: null
            }

        }
    }
</script>
