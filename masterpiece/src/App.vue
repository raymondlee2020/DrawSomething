<template>
  <div id="app">
    <greet-bar></greet-bar>
    <router-view />
  </div>
</template>

<script>
import GreetBar from "@/components/GreetBar.vue";
import {mapMutations} from "vuex"

export default {
  name: "app",
  components: {
    GreetBar
  },
  methods: {
    ...mapMutations(["connect", "disconnect", "refreshOnlineCount"])
  },
  sockets: {
    // Update socket-connected status.
    connect: function() {
      this.connect();
    },
    // Update online count.
    refreshOnlineCount: function(value) {
      this.refreshOnlineCount(value);
    },
    // Update socket-connected status.
    disconnect: function() {
      this.disconnect();
      this.$router.push('/');
    }
  }
};
</script>

<style>
#app {
  font-family: "Helvetica", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;
}
</style>