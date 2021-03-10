<template>
    <PublicLayout :displayLanguagePicker="false">
        <PublicContainer>
            <div class="pt-4">
                <div class="max-w-screen-lg mx-auto pb-20">
                    <div class="bg-orange300 p-4 flex items-center mx-auto">
                        <div class="container flex items-center">
                            <Icon
                                icon="exclamation-triangle"
                                class="text-display-xl mr-4 text-primary"
                            />
                            <div>
                                <div class="text-display-md text-primary mb-2">
                                    Opération impossible
                                </div>
                                <div class="mb-2">
                                    L'opération que vous avez tenté d'effectuer
                                    est momentanément impossible.<br />
                                    Cela fait suite à
                                    <a
                                        href="https://www.lemonde.fr/societe/article/2021/03/10/a-strasbourg-un-important-incendie-sur-le-site-de-l-entreprise-ovh-classe-seveso_6072548_3224.html"
                                        >l’incendie chez notre hébergeur</a
                                    >.
                                </div>
                                <div>
                                    Notre équipe technique est mobilisée.
                                    <span class="font-bold"
                                        >Retour à la normale prévue la semaine
                                        du 22 mars.</span
                                    >
                                    Nous vous tiendrons informés de la remise en
                                    ligne complète par mail. Toutes nos excuses
                                    pour le désagrément et merci de votre
                                    patience.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicContainer>
    </PublicLayout>
</template>

<script>
import PublicLayout from "#app/components/PublicLayout/index.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";

export default {
    components: {
        PublicContainer,
        PublicLayout
    }
};
</script>
