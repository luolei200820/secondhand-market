<template>
  <div class="order-card">
    <div class="order-header">
      <div>订单号：{{ order.id }}</div>
      <div>下单时间：{{ formatDate(order.createdAt) }}</div>

      <div
        class="product-card"
        v-for="product in JSON.parse(order.products)"
        :key="product.id"
      >
        <van-image
          class="product-img"
          width="100px"
          height="100px"
          @click="$emit('clickImg')"
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
          </div>
          <slot name="action"></slot>
        </div>
      </div>

      <van-divider />

      <div style="text-align: right">
        总价：
        <span class="order-totalPrice">{{ order.totalPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import imgURL from "../utils/imgURL";

export default {
  props: {
    order: Object,
  },
  methods: {
    imgURL,
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
  },
};
</script>

<style scoped>
.order-card {
  border-radius: 10px;
  padding: 10px;
  background-color: white;
}
.order-totalPrice {
  color: orangered;
  font-size: 20px;
  font-weight: 600;
}
.order-totalPrice::before {
  content: "￥";
  font-size: 12px;
}
.product-card {
  display: flex;
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
.product-title {
  font-size: 16px;
}
.product-text {
  flex-grow: 1;
}
.product-action {
  text-align: right;
}
</style>