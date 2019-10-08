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
      matchMessage: "Matching."
    };
  },
  methods: {
    cancel: function() {
      this.$router.push("/login");
    }
  },
  sockets: {
    gotoGameUI: function(roomInfo) {
      this.$store.commit("setRoom", roomInfo.id);
      this.$store.commit("setOpponent", roomInfo.players[0].name);
      this.$store.commit("setOpponent", roomInfo.players[1].name);
      this.$router.push("/game");
    }
  },
  created: function() {
    let v = this;
    setInterval(function() {
      setTimeout(function() {
        v.matchMessage = "Matching.";
      }, 1000);
      setTimeout(function() {
        v.matchMessage = "Matching..";
      }, 2000);
      setTimeout(function() {
        v.matchMessage = "Matching...";
      }, 3000);
    }, 3000);
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