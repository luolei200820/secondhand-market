<template>
  <div class="shoppingCartItem">
    <van-image
      fit="cover"
      width="100"
      height="100"
      class="commodity-image"
      :src="imgURL(shoppingCartItem.Commodity.mainImg)"
    />
    <div class="shoppingCartItem-right">
      <div class="commodity-title van-ellipsis">
        {{ shoppingCartItem.Commodity.title }}
      </div>
      <div class="commodity-price van-ellipsis">
        {{ shoppingCartItem.Commodity.price }}
      </div>
      <div class="action">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script>
import imgURL from "../utils/imgURL";

export default {
  name: "ShoppingCartItem",
  props: {
    shoppingCartItem: Object,
  },
  methods: {
    imgURL,
  },
};
</script>

<style scoped>
.shoppingCartItem {
  border-radius: 10px;
  background-color: white;
  display: flex;
  padding: 10px;
  margin-bottom: 5px;
}
.commodity-title {
  font-size: 14px;
}
.commodity-image {
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}
.commodity-price {
  font-size: 20px;
  font-weight: bold;
  color: red;
}
.commodity-price::before {
  content: "￥";
  font-size: 10px;
}
.shoppingCartItem-right {
  padding: 10px;
  width: 180px;
}
.action {
  margin-top: 10px;
}
</style>