<template>
    <div>
        <TextInput name="someInput" placeholder="hello world" v-model="textValue" />
        {{textValue}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                textValue: ''
            }
        }
    }
</script>
