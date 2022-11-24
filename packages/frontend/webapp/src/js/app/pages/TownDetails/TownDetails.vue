<template>
    <div class="flex pt-10 ">
    <div class="flex-1">
        <TownDetailsClosedData
        v-if="town.closedAt !== null"
        :town="town"
        class="mb-10"
        />
        <TownDetailsPanelPlans
        v-if="town.plans.length"
        :town="town"
        class="mb-10"
        id="plans"
        />
    </div>

    <div class="bg-orange200 py-10">
      <PrivateContainer class="flex items-center">
        <div class="leftColumnWidth text-sm">
          <TownDetailsNewCommentLeftColumn
            class="mb-4"
            icon="info-circle"
            title="À qui sont destinés les messages ?"
            description="À tous les acteurs du site. Un mail est automatiquement envoyé aux personnes signalées « intervenant sur ce site», aux acteurs en DDETS, Préfecture et la Dihal."
          ></TownDetailsNewCommentLeftColumn>
          <TownDetailsNewCommentLeftColumn
            icon="exclamation-triangle"
            title="Quelles sont les règles de confidentialités ?"
            description="Ne pas citer l’identité des individus (nom, âge, sexe, origine…), ni les infos relatives à d'éventuelles condamnations judiciaires. Ne pas tenir de propos à visée insultante, discriminatoire, raciste…"
          ></TownDetailsNewCommentLeftColumn>
        </div>
        <TownDetailsNewComment
          :class="['flex-1', comments.length === 0 && 'pb-32']"
          id="newComment"
          :user="user"
          :nbComments="comments.length"
          :departementCode="town.departement.code"
        />
      </PrivateContainer>
    </div>
    <div
      :class="['bg-orange200', 'pt-10', comments.length > 0 && 'pb-32']"
      v-if="comments.length"
    >
      <PrivateContainer class="flex" id="comments">
        <div class="leftColumnWidth" />
        <TownDetailsComments class="flex-1" :comments="comments" />
      </PrivateContainer>
    </div>

    <!--  Close Shantytown Modal -->
    <TownDetailsCloseModal
      :town="town"
      :isOpen="closeOpen"
      v-on:closeModal="closeOpen = false"
    />
  </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import PrivateLayout from "#app/components/PrivateLayout";
import { destroy as deleteTown } from "#helpers/api/town";
import TownDetailsHeader from "./TownDetailsHeader";
import TownDetailsLeftColumn from "./TownDetailsLeftColumn";
import TownDetailsClosedData from "./TownDetailsClosedData";
import TownDetailsPanelPlans from "./TownDetailsPanelPlans";
import TownDetailsNewComment from "./TownDetailsNewComment";
import TownDetailsComments from "./TownDetailsComments";
import TownDetailsNewCommentLeftColumn from "#app/components/NewCommentLeftColumn/NewCommentLeftColumn.vue";
import TownDetailsCloseModal from "./TownDetailsCloseModal";
import Export from "#app/components/export2/TownExport.vue";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import { notify } from "#helpers/notificationHelper";

export default {
  components: {
    TownDetailsCloseModal,
    TownDetailsNewComment,
    TownDetailsComments,
    PrivateLayout,
    PrivateContainer,
    TownDetailsHeader,
    TownDetailsLeftColumn,
    TownDetailsClosedData,
    TownDetailsPanelPlans,
    TownDetailsNewCommentLeftColumn,
    Export,
    LoadingError
  },
  data() {
    return {
      closeOpen: false,
      error: null,
      loading: false
    };
  },
  computed: {
    hasJusticePermission() {
      return (
        this.$store.getters["config/hasLocalizedPermission"](
          "shantytown_justice.access",
          this.town
        ) === true
      );
    },
    comments() {
      if (!this.town) {
        return [];
      }

      return [...this.town.comments.regular, ...this.town.comments.covid].sort(
        (a, b) => b.createdAt - a.createdAt
      );
    }
  },
  methods: {
    openCancel() {
      this.closeOpen = true;
    },
    deleteTown() {
      if (
        !confirm(
          "Êtes-vous sûr(e) de vouloir supprimer définitivement ce site ? Cette suppression est irréversible."
        )
      ) {
        return;
      }

      deleteTown(this.$route.params.id)
        .then(() => {
          notify({
            group: "notifications",
            type: "success",
            title: "Succès",
            text: "Le site a été supprimé définitivement de la base"
          });
          this.$router.replace("/liste-des-sites");
        })
        .catch(error => {
          alert(error.user_message);
        });
    }
  }
};
</script>
