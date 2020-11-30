<template>
  <div>
    <div :class="['bg-'+color,'h-24 w-24']" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String
    }
  }
}
</script>
