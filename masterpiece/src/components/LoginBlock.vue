<template>
  <div id="loginblock">
    <h1>Masterpiece</h1>
    <form>
      <input type="text" id="nameinput" v-model="userName" placeholder="Your name." />
      &nbsp;
      <!-- 不要用submit..會跳url -->
      <button @click="login">Let's Draw！</button>
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
    /**
     * 跳轉頁面要最後做
     */
    login: function() {      
      this.$store.commit('login', this.userName);
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