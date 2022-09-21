<template>
    <Layout>
        <div class="px-8">
            <header>
                <div class="flex justify-between">
                    <h1 class="font-bold text-lg">Liste de vos notes</h1>
                    <Button icon="plus" variant="primaryText" />
                </div>
                <p class="hidden md:block">
                    Prenez des notes de vos passages sur le terrain puis
                    partagez les facilement dans les journaux des sites ou par
                    mail à vos collaborateur(ice).
                </p>
            </header>

            <section class="mt-12 text-center">
                <img
                    src="/img/illustrations/notes_empty.svg"
                    class="w-1/2 mx-auto max-w-lg"
                />
                <Button>Cliquez ici pour rédiger votre première note</Button>
            </section>
        </div>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Layout,
        Button
    }
};
</script>
