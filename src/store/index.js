import { createStore } from 'vuex';  // 使用 createStore 创建 Vuex store
import { Player } from '@/ncm/player';  // 引入 Player 类
import { Login } from '@/ncm/login';

export default createStore({
    state() {
        return {
            sidebarWidth: 230, // 初始化 sidebarWidth 为 230
            player: new Player(), // 初始化 player 为一个 Player 实例
            login: new Login(), // 初始化 login 为一个 Login 实例
        };
    },
    mutations: {
        setSidebarWidth(state, width) {
            state.sidebarWidth = width;
        },
    },
    actions: {
        updateSidebarWidth({ commit }, width) {
            commit('setSidebarWidth', width);
        },
    },
});