<template>
  <div id="waitblock">
    <h1>{{matchMessage}}</h1>
    <button @click="cancel">Cancel</button>
  </div>
</template>

<script>
import {mapMutations} from "vuex"

export default {
  name: "WaitBlock",
  data() {
    return {
      matchMessage: "Matching...",
      timer: null
    };
  },
  methods: {
    ...mapMutations(['setRoom', 'setOpponent']),
    // Deal with CANCEL LOGIN action from user.
    cancel: function() {
      this.$router.push("/login");
      this.$sockets.emit("cancel");
    }
  },
  sockets: {
    // Init a room for users.
    gotoGameUI: function(roomInfo) {
      this.setRoom(roomInfo.id);
      this.setOpponent(roomInfo.players[0].name);
      this.setOpponent(roomInfo.players[1].name);
      this.$router.push("/game");
    }
  },
  // Init the timer for wait message animation.
  mounted() {
    if(!this.timer){
      this.timer = setInterval(() => {
        if(this.matchMessage.length < 11){
          this.matchMessage += '.';
        }else{
          this.matchMessage = 'Matching';
        }
      }, 1000)
    }
  },
  // Clear the timer before user leaves the page.
  beforeDestroy() {
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