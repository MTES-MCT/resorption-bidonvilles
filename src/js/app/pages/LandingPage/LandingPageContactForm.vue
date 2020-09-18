<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-xl">
        <Input class="hidden md:block flex-1" width="expand" :placeholder="$t('landingPage.contactForm.email')" />
        <Button variant="secondary" class="ml-1 w-64">{{$t('landingPage.contactForm.cta')}}</Button>
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
