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

    <DsfrFooter descText="Un problème, une question ?"/>
  </div>
</template>

<script setup>
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
    to: '/login',
    text: 'Se connecter',
  },
  {
    to: '/access',
    text: 'Demander un accès',
  },
]

</script>
