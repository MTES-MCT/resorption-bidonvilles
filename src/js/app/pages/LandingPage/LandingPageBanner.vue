<template>
    <div class="bg-corail text-white full-width text-center py-16">
        <div class="text-2xl"><slot /></div>
        <div class="pt-4"><Button variant="primary">{{cta}}</Button></div>
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
