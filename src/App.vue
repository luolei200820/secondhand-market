<template>
  <div id="app">
    <keep-alive include="Home">
      <router-view></router-view>
    </keep-alive>
    <van-tabbar route v-if="$route.meta.showTabbar" fixed>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="add-o" to="/commodity/upload">上传商品</van-tabbar-item>
      <van-tabbar-item
        :badge="numberOfItems"
        icon="shopping-cart-o"
        to="/shopping-cart"
      >
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    numberOfItems() {
      return this.$store.state.shoppingCartItemList.length;
    },
  },
};
</script>
<style>
body {
  color: #323233;
  background-color: #f8f8f8;
}
</style>