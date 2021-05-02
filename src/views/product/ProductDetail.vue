<template>
  <div class="product-detail">
    <van-nav-bar
      fixed
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <div v-else class="product">
      <div class="card-section">
        <div class="product-user">
          <van-image
            width="50"
            height="50"
            round
            :src="imgURL(product.User.avatar) || defaultAvatar"
          ></van-image>
          <div>
            <div>{{ product.User.username }}</div>
          </div>
        </div>

        <div>
          <span class="product-price">{{ product.price }}</span>
          <span class="product-subtext">{{ product.wanted }}人想要</span>
        </div>

        <div class="product-title">{{ product.title }}</div>
        <div class="product-text">{{ product.text }}</div>

        <table class="product-table">
          <tr>
            <th>分类</th>
            <td>{{ product.category }}</td>
          </tr>
          <tr>
            <th>交易地址</th>
            <td>{{ product.transactionAddress }}</td>
          </tr>
          <tr>
            <th>上架时间</th>
            <td>{{ formatDate(product.createdAt) }}</td>
          </tr>
        </table>
      </div>

      <van-divider>图片详情</van-divider>

      <van-image
        class="product-img"
        :src="imgURL(product.mainImg)"
        lazy-load
      ></van-image>
      <van-image
        class="product-img"
        v-for="img in detailImgs"
        :key="img"
        :src="img"
      ></van-image>

      <div class="card-section">
        <div class="comment-header">评论</div>
        <div
          class="comment-container"
          v-for="comment in product.Comments"
          :key="comment.id"
        >
          <div class="comment-user">
            <van-image
              class="comment-user--avatar"
              width="30"
              height="30"
              round
              :src="imgURL(comment.User.avatar) || defaultAvatar"
            ></van-image>
            <div>
              <div class="comment-user--username">
                {{ comment.User.username }}
              </div>
              <div class="comment-user--createdAt">
                {{ formatDate(comment.createdAt) }}
              </div>
            </div>
          </div>
          <div class="comment-text">
            {{ comment.text }}
          </div>
          <van-divider />
        </div>
        <div
          v-if="product.Comments.length"
          @click="$router.push(`/product/comments/${$route.params.id}`)"
          class="see-more"
        >
          查看更多
        </div>
        <div v-else>还没有任何评论</div>
      </div>

      <van-form class="card-section" ref="form">
        <van-field
          label="留言"
          placeholder="请输入留言"
          v-model="comment"
          type="textarea"
          autosize
          show-word-limit
          maxlength="200"
          :rules="[{ required: true, message: '请输入留言' }]"
        />
        <van-button
          round
          block
          type="info"
          @click="submitComment"
          class="comment-submit"
        >
          提交
        </van-button>
      </van-form>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        icon="like-o"
        text="想要"
        :color="isLiked ? 'red' : '#323233'"
        @click="clickLike"
      />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        @click="$router.push(isLogin ? '/shopping-cart' : '/login')"
        :badge="shoppingCartItemsLength"
      />
      <van-goods-action-button
        @click="addToCart"
        color="linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)"
        text="加入购物车"
      />
      <van-goods-action-button
        type="info"
        text="立即购买"
        @click="showBuyConfirm"
      />
    </van-goods-action>

    <van-popup v-model="showBuyPopUp" position="bottom" round>
      <div class="address-popup--content">
        <div>选择收货地址</div>
        <van-loading
          v-if="addressLoading"
          color="#1989fa"
          class="address-loading"
          >加载中...</van-loading
        >
        <div class="address-list" v-else-if="addresses">
          <van-radio-group v-model="selectedAddressId">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="address-card--select"
            >
              <van-radio
                class="address-selectbox"
                :name="address.id"
              ></van-radio>
              <address-card
                :address="address"
                class="address-card"
                @clickEdit="$router.push(`/user/address/${address.id}`)"
                @clickDelete="deleteAddress(address.id)"
              ></address-card>
            </div>
          </van-radio-group>
          <van-button type="info" size="large" round @click="clickBuy"
            >提交订单</van-button
          >
        </div>
        <div v-else>
          您还没有填写任何收货地址
          <van-button
            type="info"
            size="large"
            round
            class="add-address-btn"
            @click="$router.push('/user/address/add')"
          >
            填写收货地址
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/avatar3.jpg";
import axios from "@/axios";
import imgURL from "@/utils/imgURL";
import AddressCard from "@/components/AddressCard.vue";

export default {
  name: "ProductDetail",
  data() {
    return {
      loading: false,
      product: null,
      comment: "",
      defaultAvatar,
      isLiked: false,
      addresses: [],
      showBuyPopUp: false,
      addressLoading: false,
      buyBtnLoading: false,
      selectedAddressId: null,
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    shoppingCartItemsLength() {
      return this.$store.state.shoppingCartItems.length;
    },
    detailImgs() {
      if (!this.product.detailImgs) {
        return [];
      } else {
        return this.product.detailImgs.split(",").map((img) => {
          return this.imgURL(img);
        });
      }
    },
  },
  methods: {
    imgURL,
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    deleteAddress(id) {
      this.$dialog
        .confirm({
          message: "确认删除此地址吗",
        })
        .then(() => {
          axios
            .post("/address/delete", { id })
            .then((res) => {
              if (res.data.state === 1) {
                this.$toast.success("删除成功");
                // 从当前的列表中删除此地址
                let index = this.addresses.findIndex((item) => {
                  return item.id === id;
                });
                if (index !== -1) {
                  this.addresses.splice(index, 1);
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
        .catch(() => {});
    },
    clickLike() {
      if (!this.isLogin) {
        this.$toast.fail("您还没有登录");
        return;
      }
      axios
        .post("/product/like", { id: this.$route.params.id })
        .then((res) => {
          this.isLiked = res.data.isLiked;
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast("网络错误");
          console.log(err);
        });
    },
    showBuyConfirm() {
      if (!this.isLogin) {
        this.$toast.fail("您还没有登录");
        return;
      }
      if (this.product.soldOut) {
        return this.$toast.fail("此商品已售出");
      }
      this.showBuyPopUp = true; // 弹出地址选择
      if (this.addresses.length !== 0) {
        // 如果地址长度不为零，则返回
        return;
      }
      this.addressLoading = true;
      axios
        .get("/address/list")
        .then((res) => {
          this.addressLoading = false;
          if (res.data.state === 1) {
            res.data.addresses.forEach((address, index) => {
              // 加上是否选中的属性，默认选中默认地址
              if (address.isDefault) {
                address.selected = true;
                this.selectedAddressId = address.id;
                // 删除此位置的元素
                res.data.addresses.splice(index, 1);
                // 向数组开头添加此默认地址
                res.data.addresses.unshift(address);
              } else {
                address.selected = false;
              }
            });
            this.addresses = res.data.addresses;
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    clickBuy() {
      this.buyBtnLoading = true;
      if (this.selectedAddressId === null) {
        return this.$toast.fail("请选择收货地址");
      }
      axios
        .post("/order/add", {
          productIds: [this.product.id],
          address: this.addresses.find((address) => {
            return address.id === this.selectedAddressId;
          }),
        })
        .then((res) => {
          if (res.data.state === 1) {
            this.buyBtnLoading = false;
            this.$router.push(`/user/order/${res.data.orderId}`);
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    addToCart() {
      if (!this.isLogin) {
        this.$toast.fail("您还没有登录");
        return;
      }
      if (this.product.soldOut) {
        return this.$toast.fail("此商品已售出");
      }
      axios
        .post("/shopping-cart/add", {
          productId: this.product.id,
        })
        .then((res) => {
          if (res.data.state === 1) {
            this.$toast("成功添加到购物车");
            this.$store.commit(
              "addShoppingCartItem",
              res.data.shoppingCartItem
            );
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("网络错误");
        });
    },
    submitComment() {
      this.$refs["form"]
        .validate()
        .then(() => {
          axios
            .post("/comment/add", {
              text: this.comment,
              productId: this.product.id,
            })
            .then((res) => {
              if (res.data.state === 1) {
                this.comment = "";
                this.$toast("评论发表成功");
                this.$router.push(`/product/comments/${this.$route.params.id}`);
              } else {
                this.$toast.fail(res.data.msg);
              }
            })
            .catch((err) => {
              this.$toast.fail("网络超时");
              console.log(err);
            });
        })
        .catch(() => {});
    },
    getProduct() {
      this.loading = true;
      axios
        .get(`/product/${this.$route.params.id}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.product = res.data.product;
            this.loading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络超时");
          console.log(err);
        });
    },
    getLike() {
      if (!this.isLogin) {
        return;
      }
      axios.get(`/product/isLike?id=${this.$route.params.id}`).then((res) => {
        if (res.data.state === 1) {
          this.isLiked = true;
        } else {
          this.isLiked = false;
        }
      });
    },
  },
  created() {
    this.getProduct();
    this.getLike();
  },
  components: {
    AddressCard,
  },
};
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 96px);
}

.product-detail {
  padding: 46px 0 50px;
  min-height: calc(100vh - 96px);
}

.card-section {
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  background-color: white;
}

.product-user {
  display: flex;
}
.product-price {
  font-size: 18px;
  line-height: 20px;
  color: orangered;
}
.product-price::before {
  content: "￥";
  font-size: 10px;
}
.product-subtext {
  color: gray;
  font-size: 10px;
  float: right;
  line-height: 20px;
}
.product-title {
  margin: 15px 0;
  font-size: 16px;
  font-weight: bold;
}
.product-text {
  margin: 15px 0;
  font-size: 14px;
}
.product-img {
  display: block;
}
.product-table {
  text-align: left;
  font-size: 14px;
}
.product-table th {
  color: gray;
  width: 70px;
}

.comment-header {
  border-left: 4px solid #1989fa;
  margin-bottom: 10px;
}
.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.comment-user--avatar {
  margin-right: 10px;
}
.comment-user--username {
  font-size: 14px;
  font-weight: bolder;
}
.comment-user--createdAt {
  font-size: 12px;
  color: gray;
}
.comment-text {
  margin-top: 10px;
  font-size: 16px;
}
.comment-form {
  margin-top: 20px;
  padding-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.1);
}
.comment-submit {
  width: 95%;
  margin: 0 auto;
}
.see-more {
  font-size: 14px;
  text-align: center;
  color: #969799;
}

.address-popup--content {
  padding: 20px;
  min-height: 150px;
}
.address-loading {
  display: flex;
  height: 130px;
  justify-content: center;
  align-items: center;
}
.add-address-btn {
  position: relative;
  top: 50px;
}
.address-list {
  overflow-y: auto;
}
.address-card--select {
  display: flex;
}
.address-card {
  flex-grow: 1;
}
.address-selectbox {
  flex-shrink: 0;
}
</style>