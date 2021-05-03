<template>
  <div class="commodity">
    <van-image
      fit="cover"
      height="150"
      class="commodity-image"
      :src="imgURL(commodity.mainImg)"
    />
    <div class="commodity-content">
      <div class="commodity-title van-ellipsis">
        {{ commodity.title }}
      </div>
      <div class="commodity-user">
        <van-image
          fit="cover"
          width="30"
          height="30"
          round
          lazy-load
          :src="imgURL(commodity.User.avatar) || avatar"
        />
        <span class="commodity-user-username van-ellipsis">
          {{ commodity.User.username }}
        </span>
      </div>
      <div>发布时间：{{ formatDate(commodity.createdAt) }}</div>
      <div>所在地：{{ commodity.area }}</div>
      <div class="commodity-footer">
        <span class="commodity-price van-ellipsis">{{ commodity.price }}</span>
        <span class="commodity-sold" v-if="commodity.sold">
          <van-icon name="after-sale" size="20" />已卖出
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from "../assets/avatar3.jpg";
import imgURL from "../utils/imgURL";
import moment from "moment";
moment.locale("zh-cn");

export default {
  props: {
    commodity: Object,
  },
  data() {
    return {
      avatar,
    };
  },
  methods: {
    formatDate(str) {
      return moment(str).fromNow();
    },
    imgURL,
  },
};
</script>

<style scoped>
.commodity {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
}
.commodity-image {
  border-radius: 10px;
  overflow: hidden;
}
.commodity-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.commodity-sold {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.commodity-content {
  font-size: 10px;
}
.commodity-title {
  font-size: 14px;
  font-weight: bold;
  height: 20px;
}
.commodity-user {
  display: flex;
  align-items: center;
}
.commodity-user-username {
  margin-left: 5px;
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