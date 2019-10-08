<template>
  <div id="greetbar">
    <div id="leftbar">Hello, &nbsp;{{userName}}</div>
    <div id="rightbar">Server: &nbsp;{{isConnect}}./{{onlineCount}} &nbsp;online.</div>
  </div>
</template>

<script>
export default {
  name: "GreetBar",
  props: {},
  computed: {
    isConnect: function() {
      return this.$store.state.isConnect;
    },
    userName: function() {
      return this.$store.state.userName;
    },
    onlineCount: function() {
      return this.$store.state.onlineCount;
    }
  }
};
</script>

<style scoped>
#greetbar {
  height: 5vh;
  width: 100%;
  height: fit-content;
  display: inline-block;
}
#leftbar {
  height: fit-content;
  margin-left: 3%;
  float: left;
}
#rightbar {
  height: fit-content;
  margin-right: 3%;
  float: right;
}
</style>