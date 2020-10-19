<template>
  <notifications group="notifications" position="top center" style="width: 410px" class="fixed top-0 z-20 w-64">
    <template slot="body" slot-scope="props">
      <div :class="['text-white p-2 m-2', 'vue-notification', props.item.type]" @click="props.close">
        <div class="notification-icon"></div>
        <div class="text-white">
          <div class="text-lg">{{props.item.title}}</div>
          <div class="text-sm" v-html="props.item.text"></div>
        </div>
      </div>
    </template>
  </notifications>
</template>

<style lang="scss" scoped>
.vue-notification {
  background: #44A4FC;
  border-left: 5px solid #187FE7;

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }

  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }
}
</style>
