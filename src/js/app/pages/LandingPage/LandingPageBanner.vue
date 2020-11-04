<template>
    <div class="bg-corail text-white full-width text-center py-8">
        <PublicContainer>
            <div class="max-w-screen-md mx-auto">
                <h2 class="text-display-lg text-white "><slot /></h2>
                <div class="pt-4">
                    <router-link to="/contact"
                        ><Button variant="primary">{{
                            cta
                        }}</Button></router-link
                    >
                </div>
            </div>
        </PublicContainer>
    </div>
</template>

<script>
import Button from "#app/components/ui/Button.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";

export default {
    components: {
        Button,
        PublicContainer
    },
    props: {
        cta: {
            type: String,
            required: true
        }
    }
};
</script>
