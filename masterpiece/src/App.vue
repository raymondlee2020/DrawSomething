<template>
  <div id="app">
    <greet-bar></greet-bar>
    <router-view />
  </div>
</template>

<script>
import GreetBar from "@/components/GreetBar.vue";
// Vuex套件
import { mapMutations } from "vuex";
export default {
  name: "app",
  components: {
    GreetBar
  },
  /**
   * 不要直接影響this.$store破壞邏輯，用Vuex套件去做對應處理
   */
  methods: {
    ...mapMutations(["connect", "disconnect", "refreshOnlineCount"])
  },
  /**
   * 這邊要嘛用箭頭函式解決this問題要嘛直接給function，不要再另外assign   * 
   */
  sockets: {
    connect() {
      this.connect();
    },
    refreshOnlineCount(value) {
      this.refreshOnlineCount(value);
    },
    /**
     * 既然要記錄連線狀態，那斷線也要跟著處理
     */
    disconnect() {
      this.disconnect();
      this.$router.push('/')
    }
  }
};
</script>

<style>
#app {
  font-family: "Helvetica", "Arial", "LiHei Pro", "黑體-繁", "微軟正黑體",
    sans-serif;
}
</style>