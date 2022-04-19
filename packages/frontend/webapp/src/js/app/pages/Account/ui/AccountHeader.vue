<template>
    <div class="print:hidden">
        <PrivateContainer class="py-6">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-display-lg font-bold">
                        {{ title }}
                    </h1>
                </div>
                <div>
                    <slot />
                </div>
            </div>
        </PrivateContainer>
    </div>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";

export default {
    props: {
        title: {
            type: String
        }
    },
    components: {
        PrivateContainer
    }
};
</script>
