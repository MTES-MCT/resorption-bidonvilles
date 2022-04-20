<template>
  <ul>
    <li>
      <router-link :to="{ path: '/', hash: '#equipe' }">{{ $t("footer.aboutUs") }}</router-link>
    </li>
    <li v-if="$i18n.locale === 'fr'">
      <a href="/conditions-d-utilisation.pdf" class="text-white" download>{{
        $t("footer.cgus")   
      }}</a>
    </li>
    <li>
      <router-link to="/stats">{{ $t("footer.statistics") }}</router-link>
    </li>
    <li>
      <router-link to="/mentions-legales">{{ $t("footer.legal") }}</router-link>
    </li>
    <li>
      {{ $t("footer.RGAA") }}
    </li>
    <li>
      <a href="https://github.com/MTES-MCT/resorption-bidonvilles">
        <Icon :icon="['fab', 'github']" width="16" height="16" /> GitHub
      </a>
    </li>
  </ul>
</template>

<script>
import { Link, Icon } from "@resorptionbidonvilles/ui";

export default {
  components: {
    Icon,
    Link
  }
};
</script>
