// store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        series: [],
        category: []
    },
    mutations: {
        setSeries(state, payload) {
            state.series = payload;
        },
        setCategory(state, payload) {
            state.category = payload;
        }
    },
    actions: {
        updateSeries({ commit }, series) {
            commit('setSeries', series);
        },
        updateCategory({ commit }, category) {
            commit('setCategory', category);
        }
    },
    getters: {
        getSeries: state => state.series,
        getCategory: state => state.category
    }
});
