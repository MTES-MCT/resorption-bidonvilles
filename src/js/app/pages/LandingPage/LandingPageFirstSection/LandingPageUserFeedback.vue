<template>
    <div class="max-w-screen-sm mx-auto relative mt-16">
        <div class="text-xl feedbackText">{{$t('landingPage.firstSection.feedback.1.text')}}</div>
        <div class="text-lg font-light">{{$t('landingPage.firstSection.feedback.1.author')}}</div>
    </div>
</template>

<style lang="scss" scoped>
    .feedbackText {
        &::before {
            content: '«';
            position: absolute;
            left: -32px;
            top: -24px;

            @apply text-secondary text-size-display-xl;

        }
        &::after {
            content: '»';
            @apply ml-1 text-secondary text-size-lg
        }
    }
</style>
