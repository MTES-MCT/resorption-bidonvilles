<template>
    <div>
        <Button variant="primary" :loading="loading" @click="onClick">Click me</Button>
        <Button variant="primaryOutline" :loading="loading" @click="onClick">Click me</Button>
        <Button variant="primaryText" :loading="loading" @click="onClick">Click me</Button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false
            }
        },
        methods: {
            onClick() {
                this.loading = true

                setTimeout(() => { this.loading = false }, 2000)

            }
        }
    }
</script>
