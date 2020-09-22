<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <Input class="hidden md:block flex-1" width="expand" :placeholder="$t('landingPage.contactForm.email')" />
        <Button variant="secondary" class="ml-1">{{$t('landingPage.contactForm.cta')}}</Button>
    </div>
</template>

<script>
    import Button from '#app/components/ui/primitives/Button'
    import Input from '#app/components/ui/primitives/Input'

    export default {
        components: {
            Button,
            Input
        }
    }
</script>
