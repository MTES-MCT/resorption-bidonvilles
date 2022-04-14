<template>
    <div class="bg-corail text-white full-width text-center py-8">
        <Container>
            <div class="max-w-screen-md mx-auto">
                <h2 class="text-display-lg text-white font-bold"><slot /></h2>
                <div class="pt-4">
                    <Link :to="`${WEBAPP_URL}/contact`"
                        ><Button variant="primary">{{
                            cta
                        }}</Button></Link
                    >
                </div>
            </div>
        </Container>
    </div>
</template>

<script>
import { Link, Button } from "@resorptionbidonvilles/ui";
import Container from "~/components/Layout/Container/Container.vue";

export default {
    components: {
        Link,
        Button,
        Container
    },
    props: {
        cta: {
            type: String,
            required: true
        }
    },
    data() {
        const { WEBAPP_URL } = useRuntimeConfig();

        return {
            WEBAPP_URL
        };
    }
};
</script>
