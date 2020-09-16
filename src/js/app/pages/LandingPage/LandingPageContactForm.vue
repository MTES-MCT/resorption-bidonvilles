<template>
    <div class="flex flex-row justify-center mt-4">
        <Input class="hidden md:block" :placeholder="$t('landingPage.contactForm.email')" />
        <Button variant="secondary" class="ml-1">{{$t('landingPage.contactForm.cta')}}</Button>
    </div>
</template>

<script>
    import Button from '#app/components/ui/Button'
    import Input from '#app/components/ui/Input'

    export default {
        components: {
            Button,
            Input
        }
    }
</script>
