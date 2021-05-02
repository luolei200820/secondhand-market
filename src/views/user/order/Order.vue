<template>
  <div class="my-order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      fixed
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading
      v-if="orderListLoading"
      color="#1989fa"
      size="24px"
      class="loading"
    >
      加载中...
    </van-loading>

    <div
      v-else-if="!orderListLoading && orders.length === 0"
      class="order-empty"
    >
      <van-icon name="failure" />
      您还没有买过任何东西哦~
    </div>

    <div v-else class="order-list">
      <order-card
        class="order-card"
        v-for="order in orders"
        :key="order.id"
        :order="order"
      ></order-card>
    </div>
  </div>
</template>

<script>
import axios from "../../../axios";
import OrderCard from "../../../components/OrderCard.vue";

export default {
  data() {
    return {
      orderListLoading: false,
      orders: [],
    };
  },
  methods: {
    getOrders() {
      this.orderListLoading = true;
      axios.get("/order/list").then((res) => {
        this.orderListLoading = false;
        if (res.data.state === 1) {
          this.orders = res.data.orders;
        }
      });
    },
  },
  created() {
    this.getOrders();
  },
  components: {
    OrderCard,
  },
};
</script>

<style scoped>
.my-order {
  padding-top: 46px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
.order-list {
  padding: 10px;
}
.order-card {
  margin-bottom: 10px;
}
.order-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
  color: gray;
}
.order-empty i {
  font-size: 150px;
}
</style>