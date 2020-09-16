<template>
    <div class="bg-corail text-white full-width text-center py-16">
        <div class="container-md">
            <div class="text-display-lg text-white "><slot /></div>
            <div class="pt-4"><Button variant="primary">{{cta}}</Button></div>
        </div>
    </div>
</template>

<script>
    import Button from '#app/components/ui/Button'

    export default {
        components: {
            Button
        },
        props: {
            cta: {
                type: String,
                required: true
            }
        }
    }
</script>
