<template>
  <div>
    <Container>
      <div class="my-8 font-bold text-xl">
        Bienvenue {{ user.first_name }} {{ user.last_name }}
      </div>
      <div class="font-bold">Mes sites ({{ myTowns.length }})</div>
      <div class="italic" v-if="myTowns.length === 0">
        vous n'intervenez sur aucun site
      </div>
    </Container>
    <div
      v-if="myTowns.length > 0"
      class="whitespace-no-wrap overflow-y-auto mt-2"
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
      <div class="font-bold mt-8">
        Sites récemment consultés ({{ consultedTowns.length }})
      </div>
      <div class="italic" v-if="consultedTowns.length === 0">
        vous n'avez consulté aucun site récemment
      </div>
    </Container>

    <div
      v-if="consultedTowns.length > 0"
      class="whitespace-no-wrap overflow-y-auto mb-8 mt-2"
    >
      <Container>
        <TownCard
          v-for="town in consultedTowns"
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
      myTowns: "myTowns",
      consultedTowns: "consultedTowns",
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
