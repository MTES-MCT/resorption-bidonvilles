<template>
  <div>
    <font-awesome-icon
      :icon="icon"
      size="3x"
    />
    <h3 class="text-display-lg font-normal mt-2">
      <slot />
    </h3>
  </div>
</template>

<script>
export default {
    name: 'LandingPageFeatureBlock',
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
};
</script>
