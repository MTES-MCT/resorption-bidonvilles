<template>
  <vueper-slides
    class="no-shadow"
    fixed-height="150px"
    :visible-slides="3"
    slide-multiple
    :disableArrowsOnEdges="true"
    :arrows="false"
    :bullets="false"
    :gap="3"
    :slide-ratio="1 / 4"
    :dragging-distance="50"
    transition-speed="250"
  >
    <vueper-slide
      class="border text-sm"
      v-for="(slide, i) in itemsToDisplay"
      :key="i"
      :title="slide.title"
      :content="slide.content"
    >
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
      type: Array,
    },
  },
  components: { VueperSlides, VueperSlide },
  computed: {
    itemsToDisplay() {
      return this.items.map((item) => {
        return {
          title: item.addressSimple,
          content: item.city.name,
        };
      });
    },
  },
};
</script>
