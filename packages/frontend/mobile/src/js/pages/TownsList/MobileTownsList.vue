<template>
  <div>
    <Container>
      <div class="my-8 font-bold text-xl">
        Bienvenue {{ user.first_name }} {{ user.last_name }}
      </div>
      <span class="font-bold"> Mes sites ({{ myTowns.length }}) </span>
    </Container>
    <div
      id="section-carousel"
      class="whitespace-no-wrap overflow-y-auto mb-8 mt-2"
    >
      <Container>
        <TownCard
          v-for="town in myTowns"
          :key="town.id"
          :town="town"
        ></TownCard>
      </Container>
    </div>

    <Container>
      <Button @click="disconnect" class="mb-8"> Me déconnecter </Button>
    </Container>
  </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import TownCard from "./TownCard.vue";
import Container from "../../components/Container.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      consultedTowns: [
        {
          id: 5,
          addressSimple: "Avenue Gay Lussac",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 6,
          addressSimple: "Rue des Noyers",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 7,
          addressSimple: "57 Boulevard Feydeau",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 1,
          addressSimple: "37 Rue de Bassens",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 2,
          addressSimple: "32 Avenue du Chemin de la Vie",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 3,
          addressSimple: "74 Avenue de la Liberté",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        },
        {
          id: 4,
          addressSimple: "9 Rue du Broustey",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave"
          }
        }
      ]
    };
  },
  components: {
    Button,
    TownCard,
    Container
  },
  mounted() {
    this.load();
  },
  computed: {
    ...mapGetters({
      myTowns: "townsItems",
      error: "townsError",
      state: "townsState"
    }),
    user() {
      return this.$store.state.config.configuration.user;
    }
  },
  methods: {
    disconnect() {
      this.$router.push("/deconnexion");
    },
    load() {
      if (this.state !== "loaded") {
        this.$store.dispatch("fetchTowns");
      }
    }
  }
};
</script>
