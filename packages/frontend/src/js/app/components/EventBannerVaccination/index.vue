<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            icon="external-link-alt"
            class="justify-self-start flex-shrink-0 px-4 py-6"
            size="lg"
            variant="specialEvent"
            iconPosition="left"
            target="blank"
            href="https://hello.idealco.fr/inscription-formation-dihaldgs-vaccination/"
            >Je m'inscris au webinaire du 19 juillet
        </Button>
        <div class="justify-self-start ml-4 mt-2">
            <div>
                <span class="font-bold"
                    >Webinaire sur les enjeux de la campagne de sensibilisation
                    et de vaccination dans les bidonvilles</span
                >
                en partenariat avec la Direction Générale de la Santé - Lundi 19
                juillet de 14h à 15h.
            </div>
            <div>
                <a
                    class="link"
                    target="_blank"
                    href="https://hello.idealco.fr/inscription-formation-dihaldgs-vaccination/"
                    >En savoir plus</a
                >.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        shouldBeVisible() {
            return new Date() < new Date("2021-07-20");
        }
    }
};
</script>
