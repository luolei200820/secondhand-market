<template>
  <div class="my-soldout">
    <van-nav-bar
      fixed
      title="我卖出的商品"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <div class="product-empty" v-else-if="!loading && products.length === 0">
      <!-- 不在加载且商品长度为零 -->
      <van-icon name="failure" />
      您还没有发布任何商品哦~
    </div>

    <div v-else class="product-list">
      <div class="product-card" v-for="product in products" :key="product.id">
        <van-image
          class="product-img"
          width="100px"
          height="100px"
          @click="goToProductDetail(product.id)"
          :src="imgURL(product.mainImg)"
          lazy-load
        ></van-image>
        <div class="product-card--body">
          <div class="product-title van-ellipsis">
            {{ product.title }}
          </div>
          <div class="product-text van-multi-ellipsis--l2">
            {{ product.text }}
          </div>
          <div class="product-price--container">
            <div class="product-price van-ellipsis">{{ product.price }}</div>
            <div class="product-wanted">{{ product.wanted }}人想要</div>
          </div>
          <div class="product-action">
            <van-button
              size="mini"
              @click="$router.push(`/product/edit/${product.id}`)"
            >
              编辑
            </van-button>
            <van-button size="mini" @click="showConfirmDialog(product.id)">
              删除
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../../axios";
import imgURL from "../../../utils/imgURL";

export default {
  data() {
    return {
      loading: false,
      products: [],
    };
  },
  methods: {
    imgURL,
    goToProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    getProducts() {
      axios
        .get("/product/my-sold")
        .then((res) => {
          if (res.data.state === 1) {
            this.products = res.data.products;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    showConfirmDialog(productId) {
      this.$dialog
        .confirm({
          title: "确认删除",
          message: "你确定删除此商品？",
        })
        .then(() => {
          axios
            .post("/product/delete", { productId })
            .then((res) => {
              if (res.data.state === 1) {
                this.$toast.success("删除成功");
                const index = this.products.findIndex((product) => {
                  if (product.id === productId) return true;
                });
                if (index !== -1) {
                  this.products.splice(index, 1);
                }
              } else {
                this.$toast.fail(res.data.msg);
              }
            })
            .catch((err) => {
              this.$toast.fail("网络错误");
              console.log(err);
            });
        })
        .catch(() => {
          console.log("cancel");
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

<style scoped>
.my-soldout {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.product-manage {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.product-list {
  padding: 10px;
}
.product-card {
  margin-bottom: 10px;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
}
.product-card--body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.product-img {
  margin-right: 10px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}
.product-price--container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-price {
  color: orangered;
  font-size: 16px;
  font-weight: 600;
}
.product-price::before {
  content: "￥";
  font-size: 10px;
}
.product-wanted {
  flex-shrink: 0;
  font-size: 12px;
  color: gray;
}
.product-title {
  font-size: 16px;
}
.product-text {
  flex-grow: 1;
}
.product-action {
  text-align: right;
}
.product-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
  color: gray;
}
.product-empty i {
  font-size: 150px;
}
</style>