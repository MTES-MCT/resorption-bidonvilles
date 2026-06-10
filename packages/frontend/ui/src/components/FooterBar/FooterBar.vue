<template>
    <DsfrFollow class="mt-8">
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
                size="lg"
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
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    CONTACT_EMAIL: String,
});
const { CONTACT_EMAIL } = toRefs(props);

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
        onClick: () => globalThis.window != undefined && globalThis.window.open(`mailto:${CONTACT_EMAIL.value}`)
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
        onClick: () => globalThis.window != undefined && globalThis.window.open('https://fr.linkedin.com/company/dihal', '_blank'),
      }
    ]
  }
}

// Paramétrage du footer DSFR
const footerDatas = {
    descText: "Un produit de la Délégation Interministérielle à l'Hébergement et à l'Accès au Logement (DIHAL).",
    ecosystemLinks: [
      {
        label: CONTACT_EMAIL.value,
        href: `mailto:${CONTACT_EMAIL.value}`
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
        to: "/stats"
      },
      {
        label: 'Conditions générales d\'utilisation',
        target: '_blank',
        to: "/doc/conditions-d-utilisation.pdf"
      },
    ],
    mandatoryLinks: [
      {
        label: 'Accessibilité: non conforme',
        to: "/accessibilite"
      }, {
        label: 'Mentions légales',
        to: "/mentions-legales"
      }, {
        label: 'Données personnelles',
        to: "/doc/conditions-d-utilisation.pdf"
      }, {
        label: 'Gestion des cookies',
        to: "/doc/conditions-d-utilisation.pdf"
      }
    ],
    licenceName: "licence AGPL-3.0",
    licenceTo: "https://github.com/MTES-MCT/resorption-bidonvilles/blob/develop/LICENSE",
}
</script>
