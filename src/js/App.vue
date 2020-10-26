<template>
  <div id="app">
    <router-view />
    <notifications
      group="notifications"
      position="top center"
      style="width: 410px"
      class="customNotifications"
    >
      <template slot="body" slot-scope="props">
        <div :class="['vue-notification', props.item.type]" @click="props.close">
          <div class="notification-icon"></div>
          <div class="notification-content">
            <div class="notification-title">{{ props.item.title }}</div>
            <div class="notification-content" v-html="props.item.text"></div>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>
