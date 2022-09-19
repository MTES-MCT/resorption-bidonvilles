<template>
  <vueper-slides
    class="no-shadow"
    fixed-height="150px"
    :visible-slides="3"
    slide-multiple
    :disableArrowsOnEdges="false"
    :arrows="true"
    :bullets="false"
    :gap="3"
    :slide-ratio="1 / 4"
    transition-speed="250"
  >
    <vueper-slide
      class="border rounded text-sm "
      v-for="(item, i) in items"
      :key="i"
    >
      <template #content>
        <p class="font-bold">
          {{ item.addressSimple }}
        </p>
        <p>
          {{ item.city.name }}
        </p>
      </template>
    </vueper-slide>
  </vueper-slides>
</template>
<script>
// import slider components
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
export default {
  props: {
    items: {
      type: Array
    }
  },
  components: { VueperSlides, VueperSlide },
  computed: {
    itemsToDisplay() {
      return this.items.map(item => {
        return {
          title: item.addressSimple,
          content: item.city.name
        };
      });
    }
  }
};
</script>
