<template>
    <div
        class="full-width h-auto mx-auto mt-8 mb-16 bg-orange300 rounded-lg overflow-hidden"
    >
        <div class="lg:flex">
            <div class="lg:flex-shrink-0 justify-center">
                <img
                    width="260"
                    height="146"
                    class="m-4"
                    :src="img"
                    :alt="alt"
                />
            </div>
            <div class="flex-shrink-0 lg:flex-shrink px-8 py-2 lg:py-4 lg:px-4">
                <div class="tracking-wide text-display-md font-bold text-primary">
                    <slot name="title"></slot>
                </div>
                <p class="mt-2 text-md">
                    <slot name="content"></slot>
                </p>
            </div>
            <div class="lg:mt-6 flex-shrink-0 px-8 py-2 lg:p-8">
                <a
                    :href="href"
                    target="_blank"
                >
                    <Button class="my-2" variant="secondary"
                        >Je m'inscris</Button
                    >
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";

export default {
    props: {
        img: {
            type: String,
            required: true
        },
        href: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        }
    },
    components: {
        Button
    }
}
</script>