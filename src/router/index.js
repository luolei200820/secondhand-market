import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const Market = () => import('../views/market/Market.vue')
const Home = () => import('../views/market/children/Home.vue')
const Category = () => import('../views/market/children/Category.vue')
const ShoppingCart = () => import('../views/market/children/ShoppingCart.vue')
const User = () => import('../views/market/children/User.vue')
const ProductUpload = () => import('../views/product/ProductUpload.vue')
const ProductSearch = () => import('../views/product/ProductSearch.vue')
const ProductDetail = () => import('../views/product/ProductDetail.vue')
const ProductComment = () => import('../views/product/ProductComment.vue')
const ProductEdit = () => import('../views/product/ProductEdit.vue')
const UserInfo = () => import('../views/user/UserInfo.vue')
const Address = () => import('../views/user/address/Address.vue')
const AddressAdd = () => import('../views/user/address/AddressAdd.vue')
const AddressEdit = () => import('../views/user/address/AddressEdit.vue')
const ProductManage = () => import('../views/user/product/ProductManage.vue')
const ProductSold = () => import('../views/user/product/ProductSold.vue')
const Order = () => import('../views/user/order/Order.vue')
const OrderDetail = () => import('../views/user/order/OrderDetail.vue')
const UserLogin = () => import('../views/user/UserLogin.vue')
const UserRegist = () => import('../views/user/UserRegist.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Market,
      children: [
        {
          path: '',
          redirect: 'home'
        },
        {
          path: 'home',
          component: Home,
        },
        {
          path: 'category',
          component: Category
        },
        {
          path: 'shopping-cart',
          component: ShoppingCart,
          meta: { requireLogin: true }
        },
        {
          path: 'user',
          component: User,
          meta: { requireLogin: true }
        }
      ]
    },
    {
      path: '/user/info',
      component: UserInfo,
      meta: { requireLogin: true }
    },
    {
      path: '/user/address',
      component: Address,
      meta: { requireLogin: true }
    },
    {
      path: '/user/address/add',
      component: AddressAdd,
      meta: { requireLogin: true }
    },
    {
      path: '/user/address/edit/:id',
      component: AddressEdit,
      meta: { requireLogin: true }
    },
    {
      path: '/user/product-manage',
      component: ProductManage,
      meta: { requireLogin: true }
    },
    {
      path: '/user/product-sold',
      component: ProductSold,
      meta: { requireLogin: true }
    },
    {
      path: '/user/order',
      component: Order,
      meta: { requireLogin: true }
    },
    {
      path: '/user/order/:id',
      component: OrderDetail,
      meta: { requireLogin: true }
    },
    {
      path: '/product/upload',
      component: ProductUpload,
      meta: { requireLogin: true }
    },
    {
      path: '/product/search',
      component: ProductSearch
    },
    {
      path: '/product/:id',
      component: ProductDetail
    },
    {
      path: '/product/comments/:id',
      component: ProductComment,
    },
    {
      path: '/product/edit/:id',
      component: ProductEdit,
      meta: { requireLogin: true }
    },
    {
      path: '/login',
      component: UserLogin
    },
    {
      path: '/regist',
      component: UserRegist
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    // 需要登录的页面
    if (store.state.isLogin) next()
    else {
      const token = localStorage.getItem('token')
      if (token) {
        store.dispatch('autoLogin', token).then(() => {
          if (to.meta.requireAdmin) {
            // 管理员页面
            if (store.state.user.type === 'admin') {
              next()
            } else {
              next('/404')
            }
          } else {
            next()
          }
        }).catch(() => {
          next('/login')
        })
      } else {
        next('/login')
      }
    }
  }
  else {
    // 不需要权限的页面，如果没有登录则尝试自动登录
    const token = localStorage.getItem('token')
    if (!store.state.isLogin && token) store.dispatch('autoLogin', token)
    next()
  }
})

export default router
