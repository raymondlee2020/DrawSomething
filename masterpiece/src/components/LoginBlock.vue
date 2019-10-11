<template>
  <div id="loginblock">
    <h1>Masterpiece</h1>
    <div>
      <input type="text" id="nameinput" v-model="userName" placeholder="Your name." @keyup.13="login"/>
      &nbsp;
      <input type="button" value="Let's Draw！" @click="login"/>
    </div>
  </div>
</template>

<script>
import {mapMutations} from "vuex"

export default {
  name: "LoginBlock",
  data() {
    return {
      userName: ''
    }
  },
  methods: {
    ...mapMutations(['setUserName']),
    // Deal with LOGIN action from user.
    login: function() {
      this.setUserName(this.userName);
      this.$socket.emit('login', this.userName);
      this.$router.push("/wait");
    }
  }
};
</script>

<style scoped>
#loginblock {
  text-align: center;
  height: 200px;
  padding: 15%;
}
.form {
  position: inline-block;
}
</style>