<template>
  <div id="greetbar">
    <div id="leftbar">Hello, &nbsp;{{userName}}</div>
    <div id="rightbar">Server: &nbsp;{{isConnect}}./{{onlineCount}} &nbsp;online.</div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex"

export default {
  name: "GreetBar",
  computed: {
    ...mapState(['userName', 'onlineCount']),
    ...mapGetters(['isConnect'])
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