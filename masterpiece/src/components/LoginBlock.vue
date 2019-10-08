<template>
  <div id="loginblock">
    <h1>Masterpiece</h1>
    <form>
      <input type="text" id="nameinput" v-model="userName" placeholder="Your name." />
      &nbsp;
      <input type="submit" value="Let's Draw！" @click="login"/>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginBlock",
  data() {
    return {
      userName: ''
    }
  },
  methods: {
    login: function() {
      this.$router.push("/wait");
      this.$store.commit('login', this.userName);
      this.$socket.emit('login', this.userName);
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