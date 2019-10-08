import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const vuex = new Vuex.Store({
    state: {
        // 這邊用boolean比較適合
        isConnect: false,
        // Count用Number
        onlineCount: 0,
        userName: '',
        opponentName: '',
        roomId: '',
        isDrawer: false
    },
    /**
     * 有用到就要寫getters
     */
    getters: {
        isConnect: state => {
            return state.isConnect ? 'Connected' : 'Disconnected'
        },
        userName: state => {
            return state.userName
        },
        onlineCount: state => {
            return state.onlineCount
        },
    },
    mutations: {
        connect(state) {
            state.isConnect = true;
        },
        /**
         * 應該要有這個事件
         * @param {*} state 
         */
        disconnect(state) {
            state.isConnect = false;
        },
        login(state, name) {
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
            if (state.userName != name) {
                state.opponentName = name;
            }
        },
        setIsDrawer(state, boo) {
            state.isDrawer = boo;
        }
    }
});

export default vuex;