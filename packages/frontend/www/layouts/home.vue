<template>
    <Layout>
        <template v-slot:anchors v-if="$i18n.locale === 'fr'">
            <a href="#plateforme" aria-label="Accéder au paragraphe présentant la plateforme">La plateforme</a>
            <a href="#strategie" aria-label="Accéder au paragraphe présentant la stratégie de résorption">La stratégie de
                résorption</a>
            <a href="#faq" aria-label="Accéder à la foire aux questions">FAQ</a>
            <a href="#equipe" aria-label="Accéder au paragraphe présentant l'équipe'">{{ $t("aboutUs") }}</a>
            <a href="https://blog.resorption-bidonvilles.dihal.gouv.fr" target="_blank" aria-label="Accéder au blog"> Blog <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
        </template>

        <slot />
    </Layout>
</template>

<script setup>
import Layout from "~/components/Layout/Layout.vue";

const i18n = useI18n();
</script>
