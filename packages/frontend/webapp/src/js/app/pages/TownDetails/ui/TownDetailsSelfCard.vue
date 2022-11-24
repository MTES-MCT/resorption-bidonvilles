<template>
  <div class="bg-blue100 p-4 flex">
    <div class="mr-2"><Icon icon="user" /></div>
    <div class="flex-grow">
      <div class="mt-1">
        <TownDetailsSelfTag
          v-for="theme in actor.themes"
          v-bind:key="theme.id"
          :townId="townId"
          :userId="actor.id"
          :themeId="theme.id"
        >
          {{ theme.value || themes[theme.id] }}
        </TownDetailsSelfTag>
      </div>
    </div>
  </div>
</template>

<script>
import TownDetailsSelfTag from "./TownDetailsSelfTag.vue";
import { notify } from "#helpers/notificationHelper";

export default {
  props: {
    actor: {
      type: Object,
      required: true
    },
    townId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    themes() {
      return this.$store.state.config.configuration.actor_themes;
    }
  },
  components: {
    TownDetailsSelfTag
  },
  methods: {
    async removeSelf() {
      if (this.loading === true) {
        return;
      }

      this.loading = true;

      try {
        await this.$store.dispatch("removeTownActor", {
          townId: this.townId,
          userId: this.actor.id
        });

        notify({
          group: "notifications",
          type: "success",
          title: "Succès",
          text: "Vous avez été retiré(e) des intervenants "
        });
      } catch (error) {
        notify({
          group: "notifications",
          type: "error",
          title: "Échec",
          text:
            (error && error.user_message) || "Une erreur inconnue est survenue"
        });
      }

      this.loading = false;
    }
  }
};
</script>
