<template>
  <div>
    <router-link to="/" aria-label="Retourner à la page d'accueil en mode déconnecté">
      <div class="flex flex-row align-items">
        <img aria-hidden="true" width="66" height="24" class="marianne" src="~/assets/img/Navbar/Marianne.svg" alt="" />
        <div class="ml-2 text-display-xs md:text-display-sm md:font-bold text-black">
          Résorption-bidonvilles
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.marianne {
  height: 24px;
}
</style>
