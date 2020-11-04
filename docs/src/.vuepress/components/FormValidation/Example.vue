<template>
  <ValidationProvider v-slot="{ errors }"  rules="required|email" name="email">
    <input class="border px-2" v-model="value" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  }
}
</script>
