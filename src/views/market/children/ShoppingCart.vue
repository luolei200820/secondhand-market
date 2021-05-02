<template>
  <div style="padding-top: 46px; min-height: calc(100vh - 146px)">
    <van-nav-bar
      title="购物车"
      fixed
      :right-text="rightText"
      @click-right="editMode = !editMode"
    />

    <div class="item-card" v-for="item in shoppingCartItems" :key="item.id">
      <template v-if="item.Product">
        <van-checkbox
          style="flex-shrink: 0"
          v-model="item.checked"
          @click="handleSelectItem(item.id)"
        ></van-checkbox>
        <van-image
          class="item-img"
          :src="imgURL(item.Product.mainImg)"
          @click="goToProductDetail(item.Product.id)"
        />
        <div class="item-right">
          <div class="item-title van-multi-ellipsis--l2">
            {{ item.Product.title }}
          </div>
          <div class="item-price van-ellipsis">{{ item.Product.price }}</div>
        </div>
      </template>
      <div v-else>商品不存在</div>
    </div>

    <van-row
      v-if="editMode"
      type="flex"
      class="edit-bar"
      justify="space-between"
      align="center"
    >
      <van-checkbox v-model="checkAll">全选</van-checkbox>
      <van-button color="#1989fa" round style="height: 40px" @click="onDelete">
        删除
      </van-button>
    </van-row>

    <van-submit-bar
      v-else
      style="bottom: 50px"
      :price="totalPrice"
      button-text="提交订单"
      button-color="#1989fa"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import imgURL from "../../../utils/imgURL";
import axios from "../../../axios";

export default {
  data() {
    return {
      editMode: false,
    };
  },
  computed: {
    rightText() {
      return this.editMode ? "返回" : "编辑";
    },
    shoppingCartItems() {
      return this.$store.state.shoppingCartItems;
    },
    totalPrice() {
      let totalPrice = 0;
      this.shoppingCartItems.forEach((item) => {
        if (item.checked) {
          totalPrice += parseFloat(item.Product.price);
        }
      });
      return totalPrice * 100;
    },
    checkAll: {
      get: function () {
        if (!this.shoppingCartItems.length) {
          //如果购物车为空
          return false;
        } else if (this.shoppingCartItems.some((item) => !item.checked)) {
          //只要有一个商品未选中
          return false;
        } else {
          return true;
        }
      },
      set: function (newValue) {
        if (newValue) {
          //点击全选
          this.shoppingCartItems.forEach((item) => {
            item.checked = true;
          });
        } else {
          //取消全选
          this.shoppingCartItems.forEach((item) => {
            item.checked = false;
          });
        }
      },
    },
  },
  methods: {
    imgURL,
    onSubmit() {
      console.log("submit");
    },
    goToProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    handleSelectItem(id) {
      axios.post("/shopping-cart/check-item", { id });
    },
    onDelete() {
      const ids = this.shoppingCartItems.map((item) => {
        if (item.checked) {
          return item.id;
        }
      });
      axios
        .post("/shopping-cart/delete", { ids })
        .then((res) => {
          if (res.data.state === 1) {
            this.$store.commit("deleteShoppingCartItems", ids);
            this.$toast.success(res.data.msg);
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("网络正忙...");
        });
    },
  },
};
</script>

<style scoped>
.item-card {
  display: flex;
  margin: 10px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}
.item-img {
  margin: 0 10px;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  flex-shrink: 0;
  overflow: hidden;
}
.item-right {
  position: relative;
}
.item-title {
  font-size: 15px;
  word-break: break-word;
}
.item-price {
  position: absolute;
  bottom: 0;
  font-size: 18px;
  color: orangered;
}
.item-price::before {
  content: "￥";
  font-size: 10px;
}
.edit-bar {
  position: fixed;
  bottom: 50px;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0 16px;
  font-size: 14px;
  background-color: white;
  z-index: 1;
}
</style>