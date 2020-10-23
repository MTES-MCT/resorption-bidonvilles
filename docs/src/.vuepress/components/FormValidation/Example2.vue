<template>
  <div class="max-w-sm my-12">
    <TextInput label="Email" v-model="value" rules="required|email" />
  </div>
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
