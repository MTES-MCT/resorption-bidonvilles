<template>
  <footer class="bg-black text-white py-8" role="contentinfo">
    <Container>
      <div class="max-w-screen-lg mx-auto border-red border">
        <div class="md:flex flex-row justify-between">
          <FooterLeftColumn />
          <FooterRightColumn />
        </div>
      </div>
    </Container>
  </footer>
</template>

<script>
import Container from "~/components/Layout/Container/Container.vue";
import FooterLeftColumn from "./FooterLeftColumn.vue";
import FooterRightColumn from "./FooterRightColumn.vue";

export default {
  components: {
    Container,
    FooterLeftColumn,
    FooterRightColumn
  }
};
</script>
