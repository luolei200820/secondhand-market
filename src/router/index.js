import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const Home = () => import('../views/Home.vue')
const User = () => import('../views/User.vue')
const Category = () => import('../views/Category.vue')
const Login = () => import('../views/Login.vue')
const UserInfo = () => import('../views/User/UserInfo.vue')
const UserPurchase = () => import('../views/User/UserPurchase.vue')
const UserSale = () => import('../views/User/UserSale.vue')
const UserUpload = () => import('../views/User/UserUpload.vue')
const ShoppingCart = () => import('../views/ShoppingCart.vue')
const AddressList = () => import('../views/Address/AddressList.vue')
const AddressAdd = () => import('../views/Address/AddressAdd.vue')
const AddressEdit = () => import('../views/Address/AddressEdit.vue')
const CommodityDetail = () => import('../views/Commodity/CommodityDetail.vue')
const CommoditySearch = () => import('../views/Commodity/CommoditySearch.vue')
const CommodityUpload = () => import('../views/Commodity/CommodityUpload.vue')
const LeavingMessage = () => import('../views/Commodity/LeavingMessage.vue')
const Transaction = () => import('../views/Transaction.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Home,
      meta: { showTabbar: true }
    },
    {
      path: '/user',
      component: User,
      meta: { showTabbar: true, requireLogin: true }
    },
    {
      path: '/user/info',
      component: UserInfo,
      meta: { requireLogin: true }
    },
    {
      path: '/user/purchase',
      component: UserPurchase,
      meta: { requireLogin: true }
    },
    {
      path: '/user/sale',
      component: UserSale,
      meta: { requireLogin: true }
    },
    {
      path: '/user/upload',
      component: UserUpload,
      meta: { requireLogin: true }
    },
    {
      path: '/category',
      component: Category,
      meta: { showTabbar: true }
    },
    {
      path: '/shopping-cart',
      component: ShoppingCart,
      meta: { showTabbar: true, requireLogin: true }
    },
    {
      path: '/address',
      component: AddressList,
      meta: { requireLogin: true }
    },
    {
      path: '/address/add',
      component: AddressAdd,
      meta: { requireLogin: true }
    },
    {
      path: '/address/edit/:id',
      component: AddressEdit,
      meta: { requireLogin: true }
    },
    {
      path: '/commodity/upload',
      component: CommodityUpload,
      meta: { requireLogin: true }
    },
    {
      path: '/commodity/search',
      component: CommoditySearch
    },
    {
      path: '/commodity/:id',
      component: CommodityDetail
    },
    {
      path: '/commodity/:id/messages',
      component: LeavingMessage
    },
    {
      path: '/transaction',
      component: Transaction,
      meta: { requireLogin: true }
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => {
    return record.meta.requireLogin
  })) {
    if (store.state.isLogin) {
      next()
    } else {
      // 尝试自动登录
      store.dispatch('autoLogin').then(() => {
        next()
      }).catch(err => {
        console.log(err)
        next('/login')
      })
    }
  } else {
    if (!store.state.isLogin) store.dispatch('autoLogin')
    next()
  }
})

export default router
