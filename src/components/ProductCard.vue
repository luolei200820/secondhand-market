<template>
  <div class="product-card">
    <van-image
      class="product-img"
      width="100px"
      height="100px"
      @click="$emit('clickImg')"
      :src="imgURL(product.mainImg)"
      lazy-load
    ></van-image>
    <van-icon name="after-sale" />
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
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script>
import imgURL from "../utils/imgURL";

export default {
  props: {
    product: Object,
  },
  methods: {
    imgURL,
  },
};
</script>

<style scoped>
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
</style>