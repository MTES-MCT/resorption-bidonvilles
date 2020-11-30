<template>
  <div>
    <Tag :onDelete="onDelete">Éducation et scolarisation</Tag>
  </div>
</template>

<script>
export default {
  methods: {
    onDelete() {
      alert('delete')
    }
  }
}
</script>
