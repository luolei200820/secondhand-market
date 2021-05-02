import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLogin: false,
        user: null,
        shoppingCartItems: []
    },
    mutations: {
        setLogin(state, payload) {
            state.isLogin = true
            state.user = payload.user
            state.shoppingCartItems = payload.shoppingCartItems
        },
        setLogout(state) {
            state.isLogin = false
            state.user = null
            state.shoppingCartItems = []
            // 清除axios头部的token
            axios.defaults.headers['Authorization'] = ''
        },
        addShoppingCartItem(state, shoppingCartItem) {
            state.shoppingCartItems.push(shoppingCartItem)
        },
        deleteShoppingCartItems(state, ids) {
            ids.forEach(id => {
                let index = state.shoppingCartItems.findIndex(item => {
                    return item.id === id
                })
                if (index !== -1) {
                    state.shoppingCartItems.splice(index, 1)
                }
            })
        },
        setUserAvatar(state, avatar) {
            state.user.avatar = avatar
        },
        setUserUsername(state, username) {
            state.user.username = username
        }
    },
    actions: {
        autoLogin({ commit }, token) {
            return new Promise((reslove, reject) => {
                if (!token) reject(new Error('no token'))
                axios.defaults.headers['Authorization'] = token
                axios.post('/user/auto-login').then(res => {
                    if (res.data.state === 1) {
                        commit('setLogin', res.data)
                        reslove()
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
})

export default store