<template>
    <Layout>
        <template v-slot:anchors v-if="$i18n.locale === 'fr'">
            <a href="#plateforme">La plateforme</a>
            <a href="#strategie">La stratégie de résorption</a>
            <a href="#faq">FAQ</a>
            <a href="#equipe">{{ $t("footer.aboutUs") }}</a>
            <Link to="https://blog-resorption-bidonvilles.fr">Blog</Link>
        </template>

        <slot />
    </Layout>
</template>

<script setup>
import Layout from "~/components/Layout/Layout.vue";
import { Link } from "@resorptionbidonvilles/ui";
</script>