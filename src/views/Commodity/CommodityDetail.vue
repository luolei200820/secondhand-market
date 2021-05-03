<template>
  <div class="commodity-detail">
    <van-nav-bar
      fixed
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <div class="commodity-container" v-if="!loading && commodity">
      <div class="commodity-section">
        <div class="section-header">用户信息</div>
        <van-image
          fit="cover"
          width="50"
          height="50"
          round
          :src="imgURL(commodity.User.avatar) || avatar"
          class="avatar"
        ></van-image>
        <div class="user-info">
          <div>{{ commodity.User.username }}</div>
          <div>发布时间：{{ formatDate(commodity.createdAt) }}</div>
          <div>所在地：{{ commodity.area }}</div>
        </div>
      </div>

      <div class="commodity-section">
        <div class="section-header">商品信息</div>
        <table class="table">
          <tr>
            <th class="th">分类</th>
            <td>{{ commodity.Category.name }}</td>
          </tr>
          <tr>
            <th class="th">详情</th>
            <td>{{ commodity.info }}</td>
          </tr>
          <tr>
            <th class="th">状态</th>
            <td>{{ commodity.sold ? "已卖出" : "未卖出" }}</td>
          </tr>
          <tr>
            <th class="th">价格</th>
            <td class="price">{{ commodity.price }}</td>
          </tr>
        </table>
      </div>

      <div class="commodity-section">
        <div class="section-header">商品留言</div>
        <div
          class="message-card-container"
          v-for="item in commodity.LeavingMessages"
          :key="item.id"
        >
          <message-card :message="item" style="padding: 0" />
        </div>
        <van-divider
          @click="$router.push(`/commodity/${$route.params.id}/messages`)"
        >
          查看更多
        </van-divider>
      </div>

      <div class="commodity-section">
        <div class="section-header">商品图片</div>
        <van-image
          :src="imgURL(commodity.mainImg)"
          width="100%"
          lazy-load
        ></van-image>
        <van-image
          v-for="item in commodity.Images"
          :key="item.id"
          :src="imgURL(item.filename)"
          width="100%"
          lazy-load
        ></van-image>
      </div>

      <van-goods-action>
        <van-goods-action-icon icon="good-job-o" text="点赞" />
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="numberOfItems"
          @click="$router.push('/shopping-cart')"
        />
        <van-goods-action-button
          :disabled="commodity.sold"
          type="warning"
          text="加入购物车"
          @click="addToShoppingCart"
        />
        <van-goods-action-button
          :disabled="commodity.sold"
          type="danger"
          text="立即购买"
          @click="buyNow"
        />
      </van-goods-action>
    </div>

    <van-empty
      v-if="!loading && !commodity"
      class="empty"
      image="error"
      description="网络错误"
    />
  </div>
</template>

<script>
import axios from "../../axios";
import imgURL from "../../utils/imgURL";
import avatar from "../../assets/avatar3.jpg";
import moment from "moment";
import MessageCard from "../../components/MessageCard.vue";
moment.locale("zh-cn");

export default {
  name: "CommodityDetail",
  data() {
    return {
      loading: false,
      commodity: null,
      avatar,
    };
  },
  computed: {
    numberOfItems() {
      return this.$store.state.shoppingCartItemList.length;
    },
  },
  methods: {
    imgURL,
    formatDate(str) {
      return moment(str).fromNow();
    },
    buyNow() {
      if (!this.$store.state.isLogin) {
        this.$toast.fail("您还没有登录");
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      } else {
        this.$router.push(`/transaction?commodityId=${this.commodity.id}`);
      }
    },
    async addToShoppingCart() {
      if (!this.$store.state.isLogin) {
        this.$toast.fail("您还没有登录");
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
        return;
      }
      try {
        const res = await axios.post("/shoppingCart/add", {
          commodityId: this.commodity.id,
        });
        if (res.data.state === 1) {
          this.$toast.success("添加到购物车成功");
          this.$store.commit("addShoppingCartItem", res.data.shoppingCartItem);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async getCommodityDetail() {
      try {
        this.loading = true;
        const res = await axios.get(`/commodity/${this.$route.params.id}`);
        this.loading = false;
        if (res.data.state === 1) {
          this.commodity = res.data.commodity;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
  created() {
    this.getCommodityDetail();
  },
  components: { MessageCard },
};
</script>

<style scoped>
.commodity-detail {
  padding: 46px 0 50px;
  min-height: calc(100vh - 96px);
}
.commodity-container {
  padding: 10px;
}
.commodity-section {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
}
.section-header {
  font-size: 14px;
  font-weight: bold;
  border-left: 3px solid blue;
  margin-bottom: 10px;
}
.avatar {
  float: left;
}
.user-info {
  height: 50px;
  padding-left: 60px;
  font-size: 12px;
}
.table {
  font-size: 14px;
}
.th {
  width: 50px;
  vertical-align: top;
}
.price {
  font-size: 20px;
  font-weight: bold;
  color: red;
}
.price::before {
  content: "￥";
  font-size: 10px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
.empty {
  height: calc(100vh - 96px);
}
.message-card-container {
  border-bottom: 1px solid rgba(235, 237, 240, 0.5);
}
</style>