<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <TextInput class="hidden md:block flex-1" :placeholder="$t('landingPage.contactForm.email')" />
        <Button variant="secondary" class="ml-1">{{$t('landingPage.contactForm.cta')}}</Button>
    </div>
</template>

