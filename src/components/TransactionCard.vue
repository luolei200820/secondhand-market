<template>
  <div class="transaction-card">
    <van-image
      fit="cover"
      width="140"
      height="140"
      class="commodity-image"
      :src="imgURL(record.commodityMainImg)"
    />
    <div class="transaction-card-right">
      <div class="commodity-title van-ellipsis">
        {{ record.commodityTitle }}
      </div>
      <div class="commodity-area">所在地：{{ record.commodityArea }}</div>
      <div>交易时间：{{ formatDate(record.createdAt) }}</div>
      <div class="commodity-price van-ellipsis">
        {{ record.commodityPrice }}
      </div>
      <div>收件人：{{ record.addressName }}</div>
      <div>手机号码：{{ record.addressName }}</div>
      <div>省、市：{{ record.addressName }}</div>
      <div class="van-ellipsis">详细地址：{{ record.addressDetail }}</div>
    </div>
  </div>
</template>

<script>
import imgURL from "../utils/imgURL";
import moment from "moment";
moment.locale("zh-cn");

export default {
  props: {
    record: Object,
  },
  data() {
    return {};
  },
  methods: {
    imgURL,
    formatDate(str) {
      return moment(str).fromNow();
    },
  },
};
</script>

<style scoped>
.transaction-card {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 10px;
  background-color: white;
  height: 140px;
}
.transaction-card-right {
  font-size: 12px;
}
.commodity-image {
  border-radius: 10px;
  overflow: hidden;
  float: left;
}
.commodity-title {
  font-size: 14px;
  font-weight: bold;
  height: 20px;
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
</style>