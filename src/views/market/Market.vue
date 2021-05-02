<template>
  <div>
    <keep-alive include="HomePage">
      <router-view></router-view>
    </keep-alive>

    <!-- 底部导航 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/"> 首页 </van-tabbar-item>
      <van-tabbar-item icon="search" to="/category"> 分类 </van-tabbar-item>

      <van-tabbar-item
        icon="add-o"
        :to="$store.state.isLogin ? '/product/upload' : '/login'"
      >
        发布商品
      </van-tabbar-item>

      <van-tabbar-item
        icon="cart-o"
        :to="$store.state.isLogin ? '/shopping-cart' : '/login'"
        :badge="shoppingCartItemsLength"
      >
        购物车
      </van-tabbar-item>

      <van-tabbar-item
        icon="user-o"
        :to="$store.state.isLogin ? '/user' : '/login'"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    shoppingCartItemsLength() {
      return this.$store.state.shoppingCartItems.length;
    },
  },
  methods: {},
};
</script>
<style scoped>
</style>