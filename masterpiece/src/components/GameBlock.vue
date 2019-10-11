 <template>
  <div id="gameblock">
    <canvas
      ref="canvas"
      id="up-part"
      @mousedown="mouseDown"
      @mouseup="mouseUp"
      @mouseleave="mouseLeave"
      @mousemove="mouseMove"
    ></canvas>
    <div id="down-part">
      <div id="userblock">
        <div id="leftuser">
          <img src="@/assets/left.png" />
          <br />
          <br />
          <h3>{{leftUserName}}</h3>
          <div>{{isDrawerMessage}}</div>
        </div>
        <div id="rightuser">
          <img src="@/assets/right.png" />
          <br />
          <br />
          <h3>{{rightUserName}}</h3>
        </div>
      </div>
      <div id="room">
        <div id="room-message" value>
          <div>Time: {{guessTime}}</div>
          <div>{{roomMessage}}</div>
        </div>
        <div id="room-form">
          <input type="text" id="room-text" v-model="roomText" @keyup.13="onMessage" />
          <input type="submit" id="room-submit" value="Send" @click="onMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";

export default {
  name: "GameBlock",
  data() {
    return {
      roomText: "",
      roomMessage: "",
      canvas: null,
      canvasContext: null,
      isMouseDown: false,
      currentX: 0,
      currentY: 0,
      guessTime: 0,
      timer: null,
      isDrawerMessage: ""
    };
  },
  computed: {
    ...mapState({
      roomId: 'roomId',
      userName: 'userName',
      isDrawer: 'isDrawer',
      leftUserName: 'userName',
      rightUserName: 'opponentName',
    })
  },
  methods: {
    ...mapMutations(['setIsDrawer']),
    // Deal with SEND MESSAGE action from user.
    onMessage: function() {
      if (!this.isDrawer) {
        let message = this.userName + ": " + this.roomText + "\n";
        let messageInfo = {
          roomId: this.roomId,
          message: message
        };
        this.$socket.emit("onMessage", JSON.stringify(messageInfo));
        this.$socket.emit("guess", this.roomText);
        this.roomMessage += message;
        this.roomText = "";
      }
    },
    // Deal with MOUSEDOWN IN CANVAS action from user.
    mouseDown: function(e) {
      if (this.isDrawer) {
        this.isMouseDown = true;
        this.currentX = e.pageX - this.canvas.offsetLeft;
        this.currentY = e.pageY - this.canvas.offsetTop;
        let point = {
          x: this.currentX,
          y: this.currentY
        };
        this.$socket.emit("mouseDown", JSON.stringify(point));
      }
    },
    // Deal with MOUSEUP IN CANVAS action from user.
    mouseUp: function() {
      if (this.isDrawer) {
        this.isMouseDown = false;
        this.$socket.emit("mouseUp");
      }
    },
    // Deal with MOUSELEAVE IN CANVAS action from user.
    mouseLeave: function() {
      if (this.isDrawer) {
      this.isMouseDown = false;
      this.$socket.emit("mouseLeave");
      }
    },
    // Deal with MOUSEMOVE IN CANVAS action from user.
    mouseMove: function(e) {
      if (this.isMouseDown && this.isDrawer) {
        this.canvasContext.beginPath();
        this.canvasContext.lineJoin = "round";
        this.canvasContext.moveTo(this.currentX, this.currentY);
        this.canvasContext.lineTo(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.currentX = e.pageX - this.canvas.offsetLeft;
        this.currentY = e.pageY - this.canvas.offsetTop;
        let point = {
          x: this.currentX,
          y: this.currentY
        };
        this.$socket.emit("mouseMove", JSON.stringify(point));
      }
    }
  },
  sockets: {
    // Syncronize the message block.
    onMessage: function(value) {
      this.roomMessage += value;
    },
    /* Syncronize the canvas START */
    mouseDown: function(point) {
      point = JSON.parse(point);
      this.isMouseDown = true;
      this.currentX = point.x;
      this.currentY = point.y;
    },
    mouseUp: function() {
      this.isMouseDown = false;
    },
    mouseLeave: function() {
      this.isMouseDown = false;
    },
    mouseMove: function(point) {
      point = JSON.parse(point);
      if (this.isMouseDown) {
        this.canvasContext.beginPath();
        this.canvasContext.lineJoin = "round";
        this.canvasContext.moveTo(this.currentX, this.currentY);
        this.canvasContext.lineTo(point.x, point.y);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.currentX = point.x;
        this.currentY = point.y;
      }
    },
    /* Syncronize the canvas END */
    // Set timer for new game.
    gameStart: function(timestamp) {
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.guessTime = Math.floor((10000 - (Date.now() - timestamp)) / 1000);
      let that = this;
      this.timer = setInterval(() => {
        if (that.guessTime != 0) {
          that.guessTime--;
        } else {
          that.$socket.emit("gameEnd", that.roomId);
          clearInterval(that.timer);
        }
      }, 1000);
    },
    // Announce the answer.
    gameEnd: function(answer) {
      clearInterval(this.timer);
      this.isDrawerMessage = "";
      this.guessTime = 0;
      this.setIsDrawer(false);
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillText("The answer is " + answer, 100, 60);
      let that = this;
      setTimeout(function() {
        that.$socket.emit("getReady", that.roomId);
      }, 3000);
    },
    // Update isDrawer status.
    isDrawer: function() {
      this.setIsDrawer(true);
      this.isDrawerMessage = "Is Your Turn To Draw";
    },
    // Print message when the user gets the answer. 
    correctGuess: function() {
      this.roomMessage += "Congratulation！ You get the correct answer！\n";
    },
    // Announce the game end.
    wholeGameEnd: function(answer) {
      clearInterval(this.timer);
      this.setIsDrawer(false);
      this.isDrawerMessage = "";
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillText("The answer is " + answer, 100, 60);
      this.canvasContext.fillText("Game End", 100, 80);
      let that = this;
      setTimeout(function() {
        that.$router.push("/login");
      }, 5000);
    },
    // Direct to login page when other user disconnect.
    otherUserDisconnect: function() {
      clearInterval(this.timer);
      this.setIsDrawer(false);
      this.isDrawerMessage = "";
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillText("Other User Disconnect", 100, 60);
      let that = this;
      setTimeout(function() {
        that.$router.push("/login");
      }, 3000);
    }
  },
  // Init canvasContext for the page.
  mounted() {
    this.canvas = this.$refs.canvas;
    let ctx = this.canvas.getContext("2d");
    this.canvasContext = ctx;
    this.$socket.emit("getReady", this.roomId);
  }
};
</script>

<style scoped>
#up-part {
  width: 99%;
  height: 48vh;
  margin: 0.25%;
  border-style: solid;
  border-width: 1.5px;
  border-radius: 10px;
}
#down-part {
  margin: 0.25%;
  height: 44vh;
}
#userblock {
  width: 40%;
  height: 100%;
  float: left;
  border-style: solid;
  border-width: 1.5px;
  border-radius: 10px;
}
#leftuser {
  float: left;
  width: 49.5%;
  height: 100%;
  border-right-style: dotted;
  text-align: center;
}
#rightuser {
  float: left;
  width: 49.5%;
  height: 100%;
  text-align: center;
}
#room {
  width: 59%;
  height: 100%;
  margin-left: 0.5%;
  float: left;
  border-style: solid;
  border-width: 1.5px;
  border-radius: 10px;
}
#room-message {
  width: 99%;
  height: 86%;
  margin: 0.8%;
  white-space: pre-line;
  overflow: auto;
  font-size: 16px;
  line-height: 24px;
}
#room-form {
  width: 99%;
  height: 6%;
  margin: 0.5%;
}
#room-text {
  width: 90%;
  height: 100%;
  margin: 0.5%;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
}
#room-submit {
  width: 8%;
  height: 100%;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
}
</style>