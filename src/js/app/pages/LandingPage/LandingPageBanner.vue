<template>
    <div class="bg-corail text-white full-width text-center py-8">
        <div class="container">
            <div class="container-md">
                <h2 class="text-display-lg text-white "><slot /></h2>
                <div class="pt-4"><Button variant="primary">{{cta}}</Button></div>
            </div>
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
