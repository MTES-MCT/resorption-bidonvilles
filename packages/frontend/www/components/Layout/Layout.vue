<template>
  <div>
    <Html lang="fr">

    <Head>
      <Link rel="icon" href="/favicon.ico" />
      <Meta name="description"
        content="Outil d’information, de partage et de pilotage, la plateforme Résorption-bidonvilles offre une solution performante et efficace pour accélérer la résorption des bidonvilles." />
    </Head>

    </Html>

    <DsfrHeader
      :logoText="logoText"
      :homeTo="homeTo"
      :homeLabel="homeLabel"
      :serviceTitle="serviceTitle"
      :serviceDescription="serviceDescription"
      :quickLinks="quickLinks"
    >
      <template v-slot:mainnav>
        <DsfrNavigation 
          :nav-items="navItems"
          label="Menu principal"
        />
      </template>
    </DsfrHeader>

    <main id="contenu" role="main">
      <slot />
    </main>

    <DsfrFollow
      :newsletterData="{
        title: 'Un problème, une question ?',
        onlyCallout: true,
        description: 'Appelez nous au +33 1 40 81 98 80',
        buttonText: 'Nous contacter par courriel',
        buttonTitle: 'Contactez-nous par courriel',
        buttonAction: () => 'mailto:contact-resorption-bidonvilles@dihal.gouv.fr'
      }"
      :networks="[
        {
          type: 'twitter-x',
          name: 'Compte Twitter de la DIHAL',
          href: 'https://twitter.com/dihal_gouv'
        },
        {
          type: 'facebook',
          name: 'Page Facebook de la DIHAL',
          href: 'https://www.facebook.com/DIHAL.delegation.interministerielle/'
        },
        {
          type: 'linkedin',
          name: 'Page LinkedIn de la DIHAL',
          href: 'https://fr.linkedin.com/company/dihal'
        }
      ]"
    />

    <DsfrFooter
      descText="Un produit de la Délégation Interministérielle à l'Hébergement et à l'Accès au Logement."
      :ecosystemLinks="[
        {
          label: 'contact-resorption-bidonvilles@dihal.gouv.fr',
          href: 'mailto:contact-resorption-bidonvilles@dihal.gouv.fr'
        },
        {
          label: 'DIHAL',
          href: 'https://www.dihal.gouv.fr/'
        }
      ]"
      :operatorImgSrc="operatorLogo"
      operatorImgAlt="Logo Résorption-bidonvilles"
      :beforeMandatoryLinks="[
        {
          label: 'Code source',
          button: true,
          class: 'fr-icon-github-fill fr-link--icon-left mr-0',
          href: 'https://github.com/MTES-MCT/resorption-bidonvilles'
        },
        {
          label: 'Mesures d\'impact',
          href: 'https://app.resorption-bidonvilles.dihal.gouv.fr/stats'
        },
        {
          label: 'Conditions générales d\'utilisation',
          href: 'https://app.resorption-bidonvilles.dihal.gouv.fr/doc/conditions-d-utilisation.pdf'
        }
      ]"
      a11yCompliance="non conforme"
      a11yComplianceLink="https://app.resorption-bidonvilles.dihal.gouv.fr/accessibilite"
      legalLink="https://app.resorption-bidonvilles.dihal.gouv.fr/mentions-legales"
    />
  </div>
</template>

<script setup>
import operatorLogo from "~/assets/img/LandingPage/logo.png";

defineProps({
  stickyHeader: {
    type: Boolean,
    default: true
  },
  displayLanguagePicker: {
    type: Boolean,
    default: true
  }
});

// Paramétrage du header DSFR
const logoText = ["Délégation interministérielle", "à l'hébergement et à l'accès", "au logement"];
const homeTo = "/";
const homeLabel = "Accueil Résorption des bidonvilles";
const serviceTitle = 'Plateforme Résorption-Bidonvilles';
const serviceDescription = "L'accès à la plateforme est restreint aux acteurs de la résorption des bidonvilles"

// Menu de navigation
const navItems = [
  {
    to: 'app.resorption-bidonvilles.localhost/login',
    text: 'Se connecter',
  },
  {
    to: '/access',
    text: 'Demander un accès',
  },
]

</script>
<style scoped>
:deep(.fr-link--icon-left[class*=" fr-icon-"]::before) {
  margin-right: 0 !important;
}
</style>