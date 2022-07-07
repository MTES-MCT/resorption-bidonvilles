<template>
  <div>
    <div class="mx-4 my-4 font-bold text-xl">
      Bienvenue {{ user.first_name }} {{ user.last_name }}
    </div>
    <div class="mx-4 my-4">
      <span class="font-bold"> Sites à proximité </span>
      <div>
        <div class="w-full h-64">
          <Map
            :zoom="15"
            :nearbyTowns="[]"
            @locationChange="onLocationChange"
          ></Map>
        </div>
      </div>
    </div>

    <div class="mx-4 my-4">
      <span class="font-bold"> Mes sites </span>
      ({{ myTowns.length }})
      <br />
      <span>Sites sur lesquels vous intervenez</span>
      <div class="mt-4"><Carousel :items="myTowns" /></div>
    </div>

    <div class="mx-4 my-4">
      <span class="font-bold"> Sites récemment consultés </span>
      ({{ consultedTowns.length }})
      <br />
      <span
        >Les {{ consultedTowns.length }} derniers sites que vous avez
        consultés</span
      >
      <div><Carousel :items="consultedTowns" /></div>
    </div>

    <Button @click="disconnect" class="mb-8"> Me déconnecter </Button>
  </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Carousel from "../../components/Carousel.vue";
import Map from "../../components/Map.vue";
import { findNearby } from "../../helpers/town";

export default {
  data() {
    return {
      input: [48.844817, 2.310425],
      nearbyTowns: [],
      myTowns: [
        {
          id: 1,
          addressSimple: "37 Rue de Bassens",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 2,
          addressSimple: "32 Avenue du Chemin de la Vie",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 3,
          addressSimple: "74 Avenue de la Liberté",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 4,
          addressSimple: "9 Rue du Broustey",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 5,
          addressSimple: "Avenue Gay Lussac",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 6,
          addressSimple: "Rue des Noyers",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 7,
          addressSimple: "57 Boulevard Feydeau",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
      ],
      consultedTowns: [
        {
          id: 5,
          addressSimple: "Avenue Gay Lussac",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 6,
          addressSimple: "Rue des Noyers",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 7,
          addressSimple: "57 Boulevard Feydeau",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 1,
          addressSimple: "37 Rue de Bassens",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 2,
          addressSimple: "32 Avenue du Chemin de la Vie",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 3,
          addressSimple: "74 Avenue de la Liberté",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
        {
          id: 4,
          addressSimple: "9 Rue du Broustey",
          name: null,
          city: {
            name: "Ambarès-et-Lagrave",
          },
        },
      ],
    };
  },
  components: {
    Button,
    Carousel,
    Map,
  },
  computed: {
    user() {
      return this.$store.state.config.configuration.user;
    },
  },
  methods: {
    async onLocationChange(data) {
      const { towns } = await findNearby(data[0], data[1]);
      this.nearbyTowns = towns;
    },
    disconnect() {
      this.$router.push("/deconnexion");
    },
  },
};
</script>
