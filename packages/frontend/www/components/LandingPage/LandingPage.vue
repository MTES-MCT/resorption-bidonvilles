<template>
  <section id="main-content" class="fr-container width-inherit flex">
    <div class="flex flex-col lg:flex-row lg:flex-wrap lg:gap-12 pt-8 lg:pt-16">
      <div class="order-2 lg:order-1 lg:w-[calc(50%-1.5rem)]">
        <DsfrPicture
          :src="bandeau"
          alt="Photographies prises sur des bidonvilles"
          size="medium"
          legend="Crédits : Diego Inglez de Souza et Ville de Strasbourg"
          title="Photographies prises sur des bidonvilles"
          ratio="16x9"
        />
      </div>
      <div class="order-5 lg:order-3 lg:w-[calc(50%-1.5rem)]">
        <h5 class="!mb-0">
          Départements de l'Hexagone concernés selon le nombre d'habitants en
          bidonvilles
        </h5>
        <DsfrPicture
          :src="carte"
          alt="Impact des actions de résorption en France"
          size="medium"
          legend="Carte : Délégation interministérielle à l'hébergement et à l'accès au logement (DIHAL). Source: Plateforme Résorption-bidonvilles"
          title="Impact des actions de résorption en France"
          ratio="1x1"
          class="!mt-0"
        />
      </div>
      <div class="text-justify order-1 lg:order-2 lg:w-[calc(50%-1.5rem)]">
        <h5>La politique de résorption des bidonvilles</h5>
        <p>
          Vivre dans un bidonville signifie faire face à des conditions de vie
          très précaires : habitat insalubre, accès limité à l’eau, à
          l’électricité, aux soins, à la scolarisation ou à l’emploi. Pour
          répondre à ces situations, l’État met en œuvre une politique de
          résorption des bidonvilles destinée à accompagner les personnes
          concernées vers des solutions durables d’hébergement, de logement et
          d'insertion.
        </p>
        <p>
          Depuis l’instruction du 25 janvier 2018, le Gouvernement poursuit
          l’objectif de réduire durablement le nombre de bidonvilles et
          d’apporter à leurs habitants des solutions pragmatiques favorisant
          leur insertion vers le droit commun.
        </p>
        <div class="w-full flex justify-center">
          <a
            href="https://www.info.gouv.fr/organisation/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement/resorber-durablement-les-bidonvilles"
            target="_blank"
            class="text-blue-600 mt-4 inline-block"
          >
            En savoir plus sur info.gouv
          </a>
        </div>
      </div>
      <div class="text-justify order-3 lg:order-4 lg:w-[calc(50%-1.5rem)]">
        <p>
          La mission Résorption des bidonvilles accompagne les territoires
          concernés dans la mise en œuvre de stratégies locales adaptées à leurs
          réalités. Elle pilote également l’enveloppe nationale de crédits
          dédiée à cette politique publique, afin de soutenir chaque année les
          actions menées sur le terrain et d’apporter un appui technique aux
          acteurs locaux.
        </p>
        <div class="w-full flex justify-center">
          <a
            :href="BLOG_URL"
            target="_blank"
            class="text-blue-600 mt-4 mb-10 inline-block"
          >
            En savoir plus sur notre Blog
          </a>
        </div>
        <h5>
          L’outil numérique Résorption-bidonvilles au service de l’action
          publique
        </h5>
        <p>
          Afin de soutenir la mise en œuvre des stratégies territoriales,
          l’outil numérique Résorption-bidonvilles constitue un appui
          opérationnel au pilotage local et national de la politique publique.
          Il vise à renforcer la coordination entre les acteurs, fiabiliser la
          connaissance des situations et améliorer le suivi des actions
          engagées.
        </p>
        <DsfrButtonGroup
          inlineLayoutWhen="never"
          :buttons="[
            {
              label: 'Demander un accès à la plateforme',
              title: 'Demander un accès à la plateforme',
              onClick: buttonHandler.bind(
                null,
                `${WEBAPP_URL}/contact?language=fr&acces`,
              ),
            },
            {
              label: 'S\'inscrire à une session de prise en main',
              title:
                'S\'inscrire à une session de prise en main - Ouverture dans une nouvelle fenêtre',
              secondary: true,
              onClick: buttonHandler.bind(null, FORMATION_URL, '_blank'),
              target: '_blank',
            },
          ]"
        />
      </div>
    </div>
  </section>
</template>
<script setup>
import carte from "~/assets/img/LandingPage/carte.png";
import bandeau from "~/assets/img/LandingPage/resorption-bidonvilles.png";
const { WEBAPP_URL, FORMATION_URL, BLOG_URL } = useRuntimeConfig().public;

const buttonHandler = (to, target = "_self") => {
  window.open(to, target);
};
</script>
