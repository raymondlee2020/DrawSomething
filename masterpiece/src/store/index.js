import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const vuex = new Vuex.Store({
    state: {
        isConnect: false,
        onlineCount: 0,
        userName: '',
        opponentName: '',
        roomId: '',
        isDrawer: false
    },
    getters: {
        isConnect: state => state.isConnect ? 'Connected':'Unconnected'
    },
    mutations: {
        connect(state) {
            state.isConnect = true;
        },
        disconnect(state) {
            state.isConnect = false;
        },
        setUserName(state, name) {
            state.userName = name;
        },
        refreshOnlineCount(state, value) {
            state.onlineCount = value;
        },
        setRoom(state, id, n1, n2) {
            state.roomId = id
            if (state.userName == n1) {
                state.opponentName = n2;
            } else {
                state.opponentName = n1;
            }
        },
        setOpponent(state, name) {
            if (state.userName != name ) {
                state.opponentName = name;
            }
        },
        setIsDrawer(state, boo) {
            state.isDrawer = boo;
        }
    }
});

export default vuex;