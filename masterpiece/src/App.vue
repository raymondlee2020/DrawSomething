<template>
  <div id="app">
    <greet-bar></greet-bar>
    <router-view />
  </div>
</template>

<script>
import GreetBar from "@/components/GreetBar.vue";

export default {
  name: "app",
  components: {
    GreetBar
  },
  sockets: {
    connect: function() {
      this.$store.commit('connect');
      console.log('Connect Success');
    },
    refreshOnlineCount: function(value) {
      this.$store.commit('refreshOnlineCount', value);
    },
    disconnect: function() {
      console.log('Disconnect');
    }
  }
};
</script>

<style>
#app {
  font-family: "Helvetica", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;
}
</style>