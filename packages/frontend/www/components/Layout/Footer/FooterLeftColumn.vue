<template>
  <ul>
    <li>
        <Icon icon="envelope" width="16" height="16" />
    </li>
    <li>
      {{ $t("footer.contact") }}
    </li>
    <li>
        <a
          class="underline"
          href="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
          >contact@resorption-bidonvilles.beta.gouv.fr</a
        >
    </li>
    <li class="mt-2" v-if="$i18n.locale === 'fr'">
      <a
        href="https://email.developpement-durable.gouv.fr/users/subscribe/js_id/5n4i/id/1"
        class="underline"
      >
        {{ $t("footer.newsletter") }}
      </a>
    </li>
  </ul>
</template>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

export default {
  components: {
    Icon
  }
};
</script>
