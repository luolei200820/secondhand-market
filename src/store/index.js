import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: null,
        isLogin: false,
        shoppingCartItemList: []
    },
    mutations: {
        setLogin(state) {
            state.isLogin = true
        },
        setLogout(state) {
            state.isLogin = false
        },
        setUser(state, user) {
            state.user = user
        },
        setShoppingCart(state, shoppingCartItemList) {
            state.shoppingCartItemList = shoppingCartItemList
        },
        addShoppingCartItem(state, shoppingCartItem) {
            state.shoppingCartItemList.push(shoppingCartItem)
        },
        deleteShoppingCartItem(state, id) {
            let index = state.shoppingCartItemList.findIndex((item) => {
                return item.id === id;
            });
            if (index !== -1) {
                state.shoppingCartItemList.splice(index, 1);
            }
        }
    },
    actions: {
        async autoLogin({ commit }) {
            try {
                const token = localStorage.getItem('token')
                if (token) {
                    axios.defaults.headers.common['Authorization'] = token
                    const res = await axios.post('/user/auto-login')
                    if (res.data.state === 1) {
                        commit('setLogin')
                        commit('setUser', res.data.user)
                        commit('setShoppingCart', res.data.shoppingCartItemList)
                        return Promise.resolve()
                    } else {
                        return Promise.reject(new Error(res.data.msg))
                    }
                } else {
                    return Promise.reject()
                }
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
})

export default store