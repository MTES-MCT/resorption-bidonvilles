<template>
    <div
        v-if="shouldBeVisible"
        class="full-width h-auto mx-auto mt-8 mb-16 bg-orange300 rounded-lg overflow-hidden"
    >
        <div class="lg:flex items-center">
            <div class="lg:flex-shrink-0 justify-center">
                <img
                    class="h-48 m-4"
                    src="./assets/banniere_vaccin.png"
                    alt=""
                />
            </div>
            <div class="flex-shrink-0 lg:flex-shrink px-8 py-2 lg:py-8 lg:px-4">
                <div class="tracking-wide text-display-md text-primary">
                    Webinaire sur les enjeux de la campagne de sensibilisation
                    et de vaccination dans les bidonvilles
                </div>
                <div class="mt-2">
                    En partenariat avec la Direction Générale de la Santé, la
                    Dihal rassemble associations, services de l’État et
                    collectivités territoriales pour échanger et partager sur
                    les enjeux, les bonnes pratiques et l'usage de la plateforme
                    <span class="font-italic">Résorption-bidonvilles</span> dans
                    le cadre de la campagne de sensibilisation et de
                    vaccination.
                </div>
            </div>
            <div class="px-8 py-2 lg:p-8">
                <a
                    href="https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/"
                    target="_blank"
                >
                    <Button class="my-2" variant="secondary">S'inscrire</Button>
                </a>
                <p class="text-sm font-bold">Lundi 19 juillet de 14h à 15h</p>
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
