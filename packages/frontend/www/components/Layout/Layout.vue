<template>
  <div lang="fr">
    <Html lang="fr">

    <Head>
      <Link rel="icon" href="/favicon.ico" />
      <Meta name="description"
        content="Outil d’information, de partage et de pilotage, la plateforme Résorption-bidonvilles offre une solution performante et efficace pour accélérer la résorption des bidonvilles." />
    </Head>

    </Html>

    <DsfrHeader
      :logoText="headerDatas.logoText"
      :homeTo="headerDatas.homeTo"
      :homeLabel="headerDatas.homeLabel"
      :operatorImgSrc="headerDatas.operatorImgSrc"
      :operatorImgStyle="headerDatas.operatorImgStyle"
      :quickLinks="headerDatas.quickLinks"
    />

    <DsfrModal
      :opened="openedModal"
      :title="modalTitle"
      size="sm"
      lang="fr"
      @close="openedModal = false"
    >
      <template #default>
        <p lang="fr">Choisissez un thème pour personnaliser l’apparence du site.</p>
        <DsfrRadioButtonSet
          v-model="preferences.scheme"
          :options="modalParams"
          name="theme"
        />
      </template>
    </DsfrModal>

    <!-- Début du contenu dynamique de la page -->
    <main id="contenu" role="main">
      <slot />
    </main>
    <!-- Fin du contenu dynamique de la page -->

    <DsfrFollow>
      <template #default lang="fr" class="fr-container">
          <div class="fr-col-12 fr-col-md-8">
            <div class="fr-follow__newsletter">
              <div>
                <h2 class="fr-h5">{{ followDatas.contact.title }}</h2>
                <p class="fr-text--sm">{{ followDatas.contact.description }}</p>
              </div>
              <div class="w-full">
                <DsfrButtonGroup
                  inline-layout-when="md"
                  :iconRight="false"
                  :buttons="followDatas.contact.button"
                />
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-follow__social">
              <h2 class="fr-h5">{{ followDatas.networks.title }}</h2>
              <DsfrButtonGroup
                equisized
                :buttons="followDatas.networks.buttons"
              />
            </div>
          </div>
      </template>
    </DsfrFollow>

    <DsfrFooter
      :descText="footerDatas.descText"
      :logoText="footerDatas.logoText"
      :ecosystemLinks="footerDatas.ecosystemLinks"
      :beforeMandatoryLinks="footerDatas.beforeMandatoryLinks"
      :mandatoryLinks="footerDatas.mandatoryLinks"
      :afterMandatoryLinks="footerDatas.afterMandatoryLinks"
      :licenceName="footerDatas.licenceName"
      :licenceTo="footerDatas.licenceTo"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import { useScheme } from '@gouvminint/vue-dsfr'
import openMail from '~/utils/openMail';
import logoDihal_light from "~/assets/img/Layout/dihal-light.png";
import logoDihal_dark from "~/assets/img/Layout/dihal-dark.png";
const { WEBAPP_URL, CONTACT_EMAIL, BLOG_URL } = useRuntimeConfig().public;

// Icones SVG pour les thèmes clair, sombre et système
const sunSvgPath = '/artwork/pictograms/environment/sun.svg';
const moonSvgPath = '/artwork/pictograms/environment/moon.svg';
const systemSvgPath = '/artwork/pictograms/system/system.svg';

const logoDihal = ref({
  default: logoDihal_light,
  light: logoDihal_light,
  dark: logoDihal_dark
});

// Gestion de la modale et de l'affichage (thème)
const openedModal = ref(false);
const modalTitle = "Paramètres d'affichage";
const preferences = reactive({
  theme: undefined,
  scheme: 'system',
})

const modalParams = [
  {
    label: 'Thème clair',
    value: 'light',
    svgPath: sunSvgPath
  },
  {
    label: 'Thème sombre',
    value: 'dark',
    svgPath: moonSvgPath
  },
  {
    label: 'Thème système',
    value: 'system',
    svgPath: systemSvgPath
  }
];
onMounted(() => {
  const { theme, scheme, setScheme } = useScheme()
  preferences.scheme = scheme.value
  watchEffect(() => { preferences.theme = theme.value
    headerDatas.value.operatorImgSrc = logoDihal.value[preferences.theme]
   })
  watchEffect(() => setScheme(preferences.scheme))
});

// Paramétrage du header DSFR
const headerDatas = ref({
    homeTo: "/",
    homeLabel: "Accueil Résorption des bidonvilles",
    logoText: "Gouvernement",
    operatorImgSrc: preferences.theme ? logoDihal.value[preferences.theme] : logoDihal.value.default,
    operatorImgStyle: "height: auto; max-height: 3rem;",
    quickLinks: [
        {
            label: 'Connexion',
            href: `${WEBAPP_URL}/connexion`,
            icon: 'fr-icon-lock-line',
        }, {
            label: 'Accès au blog',
            href: `${BLOG_URL}`,
            icon: 'fr-icon-article-line',
            target: '_blank'
        }, {
            label: 'Paramètres d\'affichage',
            button: true,
            onClick: () => openedModal.value = true,
            icon: 'fr-icon-theme-fill',
        }
    ]
})

// Paramétrage du follow DSFR
const followDatas = {
  contact: {
    title: 'Une question sur la plateforme\u00A0?',
    description: 'Appelez nous au +33\u00A01\u00A040\u00A081\u00A098\u00A080',
    button: [
      {
        label: 'Nous contacter par courriel',
        title: 'Contactez-nous par courriel  - Ouverture de votre outils de courrier électronique',
        primary: true,
        onClick: () => openMail()
      }
    ],
  },
  networks: {
    title: 'Suivez nous sur LinkedIn',
    buttons: [
      {
        label: 'LinkedIn',
        title: 'Page LinkedIn de la DIHAL - Ouverture dans une nouvelle fenêtre',
        icon: 'fr-icon-linkedin-box-fill',
        href: 'https://fr.linkedin.com/company/dihal',
        target: '_blank'
      }
    ]
  }
}

// Paramétrage du footer DSFR
const footerDatas = {
    descText: "Un produit de la Délégation Interministérielle à l'Hébergement et à l'Accès au Logement (DIHAL).",
    ecosystemLinks: [
      {
        label: CONTACT_EMAIL,
        href: `mailto:${CONTACT_EMAIL}`
      },
      {
        label: 'DIHAL',
        href: 'https://www.dihal.gouv.fr/'
      }
    ],
    beforeMandatoryLinks: [
      {
        label: 'Code source',
        target: '_blank',
        class: 'fr-icon-github-fill fr-link--icon-left mr-0',
        href: 'https://github.com/MTES-MCT/resorption-bidonvilles'
      },
      {
        label: 'Mesures d\'impact',
        href: `${WEBAPP_URL}/stats`
      },
      {
        label: 'Conditions générales d\'utilisation',
        target: '_blank',
        href: `${WEBAPP_URL}/doc/conditions-d-utilisation.pdf`
      },
    ],
    mandatoryLinks: [
      {
        label: 'Accessibilité: non conforme',
        href: `${WEBAPP_URL}/accessibilite`
      }, {
        label: 'Mentions légales',
        href: `${WEBAPP_URL}/mentions-legales`
      }, {
        label: 'Données personnelles',
        href: `${WEBAPP_URL}/doc/conditions-d-utilisation.pdf`
      }, {
        label: 'Gestion des cookies',
        href: `${WEBAPP_URL}/doc/conditions-d-utilisation.pdf`
      }
    ],
    afterMandatoryLinks: [
      {
        label: 'Paramètres d\'affichage',
        button: true,
        onClick: () => openedModal.value = true,
        icon: 'fr-icon-theme-fill',
        class: 'fr-link--icon-left pl-1.5 md:pl-0'
      }
    ],
    licenceName: "licence AGPL-3.0",
    licenceTo: "https://github.com/MTES-MCT/resorption-bidonvilles/blob/develop/LICENSE",
}
</script>
<style scoped>
/* Amélioration de l'affichage des icônes du footer */
:deep(.fr-link--icon-left[class*=" fr-icon-"]::before) {
  margin-right: 0 !important;
}
</style>