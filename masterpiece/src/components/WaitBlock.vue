<template>
  <div id="waitblock">
    <h1>{{matchMessage}}</h1>
    <button @click="cancel">Cancel</button>
  </div>
</template>

<script>
export default {
  name: "WaitBlock",
  data() {
    return {
      matchMessage: "Matching",
      // 要用到計時就該指定timer
      timer: null
    };
  },
  methods: {
    /**
     * client端取消應該也要和server端通知
     */
    cancel: function() {
      this.$router.push("/login");
    }
  },
  sockets: {
    /**
     * 這邊Vuex要再改成methods
     * goTo <====
     */
    gotoGameUI: function(roomInfo) {
      this.$store.commit("setRoom", roomInfo.id);
      this.$store.commit("setOpponent", roomInfo.players[0].name);
      this.$store.commit("setOpponent", roomInfo.players[1].name);
      // UI流程來講這邊會出現alert再跳轉
      this.$router.push("/game");
    }
  },
  mounted() {
    /**
     * 這邊改成箭頭函式後可以直接讀取this
     * 時間迴圈應該改成這樣
     * 如果是created只會執行一次
     * 確保在timer null情況才會運作
     */
    if (!this.timer) {
      this.timer = setInterval(() => {
        if (this.matchMessage.length < 11) {
          this.matchMessage += ".";
        } else {
          this.matchMessage = "Matching";
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    // 清除timer
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style scoped>
#waitblock {
  text-align: center;
  height: 200px;
  padding: 15%;
}
.form {
  position: inline-block;
}
</style>