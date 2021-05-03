<template>
  <div class="shoppingCart">
    <van-nav-bar
      fixed
      title="购物车"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <div
      class="shoppingCartItemList"
      v-if="!loading && shoppingCartItemList.length"
    >
      <shopping-cart-item
        v-for="item in shoppingCartItemList"
        :key="item.id"
        :shoppingCartItem="item"
      >
        <template v-slot:action>
          <van-button
            size="small"
            round
            @click="
              $router.push(`/transaction?commodityId=${item.Commodity.id}`)
            "
          >
            立即购买
          </van-button>
          <van-button
            size="small"
            round
            style="margin-left: 10px"
            @click="deleteItem(item.id)"
          >
            删除
          </van-button>
        </template>
      </shopping-cart-item>
    </div>

    <van-empty
      class="empty"
      v-if="!loading && !shoppingCartItemList.length"
      description="购物车还是空无一物..."
    />
  </div>
</template>

<script>
import axios from "../axios";
import ShoppingCartItem from "../components/ShoppingCartItem.vue";

export default {
  name: "ShoppingCart",
  data() {
    return {
      loading: false,
      shoppingCartItemList: [],
    };
  },
  methods: {
    async getShoppingCartItemList() {
      try {
        this.loading = true;
        const res = await axios.get("/shoppingCart/list");
        this.loading = false;
        if (res.data.state === 1) {
          this.shoppingCartItemList = res.data.shoppingCartItemList;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async deleteItem(id) {
      try {
        const res = await axios.post("/shoppingCart/delete", { id });
        if (res.data.state === 1) {
          this.$toast.success("删除成功");
          this.$store.commit("deleteShoppingCartItem", id);
          let index = this.shoppingCartItemList.findIndex((item) => {
            return item.id === id;
          });
          if (index !== -1) {
            this.shoppingCartItemList.splice(index, 1);
          }
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
  created() {
    this.getShoppingCartItemList();
  },
  components: {
    ShoppingCartItem,
  },
};
</script>

<style scoped>
.shoppingCart {
  padding: 46px 0 50px;
  min-height: calc(100vh - 96px);
}
.shoppingCartItemList {
  padding: 10px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 96px);
}
.empty {
  height: calc(100vh - 96px);
}
</style>