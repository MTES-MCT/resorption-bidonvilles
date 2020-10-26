<template>
  <footer class="bg-black text-white py-8" role="contentinfo">
    <PublicContainer>
      <div class="max-w-screen-lg mx-auto">
        <div class="md:flex flex-row justify-between">
          <ul>
            <li><font-awesome-icon icon="envelope"></font-awesome-icon></li>
            <li><h4>Contactez l’équipe du projet</h4></li>
            <li>
              <h4>
                <a
                  class="underline"
                  href="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
                  >contact@resorption-bidonvilles.beta.gouv.fr</a
                >
              </h4>
            </li>
          </ul>

          <ul>
            <li>
              <router-link to="/statistiques-publiques"
                >Statistiques</router-link
              >
            </li>
            <li>
              <router-link to="/mentions-legales">Mentions légales</router-link>
            </li>
            <li>
              <router-link to="/typologie-des-acces"
                ><font-awesome-icon icon="file-pdf"></font-awesome-icon
                >&nbsp;Guide des accès et de l'administrateur</router-link
              >
            </li>
            <li>
              <router-link to="/charte-d-engagement"
                ><font-awesome-icon icon="file-pdf"></font-awesome-icon
                >&nbsp;Charte d'engagement de l'utilisateur</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </PublicContainer>
  </footer>
</template>

<script>
import PublicContainer from "./PublicContainer.vue";

export default {
  components: {
    PublicContainer
  }
};
</script>
