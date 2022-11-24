<template>
  <SidePanel
    :isOpen="isOpen"
    :closePanel="closePanel"
    :closeClickOutside="true"
  >
    <div class="  px-8 ">
      <div class="border-b-2 border-G200 py-4"></div>
      <div>
        <!-- Date de création du site -->

        <!-- Fin date de création du site -->
      </div>
    </div>
  </SidePanel>
</template>

<script>
import TownDetailsHistoryCard from "./TownDetailsHistoryCard";
export default {
  components: { TownDetailsHistoryCard },
  props: {
    town: {
      type: Object
    },
    isOpen: {
      type: Boolean
    },
    closePanel: {
      type: Function
    }
  },
  methods: {
    /**
     * @see index.js
     */
    formatDate(...args) {
      return window.App.formatDate.apply(window, args);
    }
  }
};
</script>

<style>
.changelogContent {
  margin-left: 22px;
}
</style>
