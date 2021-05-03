<template>
  <div class="user">
    <div class="user-card">
      <van-image
        width="70"
        height="70"
        round
        fit="cover"
        :src="imgURL(user.avatar) || avatar"
      />
      <span class="user-card-username">{{ user.username }}</span>
    </div>

    <van-grid :column-num="3">
      <van-grid-item
        icon="bag-o"
        text="我买到的"
        @click="$router.push('/user/purchase')"
      />
      <van-grid-item
        icon="after-sale"
        text="我卖出的"
        @click="$router.push('/user/sale')"
      />
      <van-grid-item
        icon="share-o"
        text="我发布的"
        @click="$router.push('/user/upload')"
      />
    </van-grid>

    <van-cell-group style="margin: 10px 0">
      <van-cell title="用户信息" is-link to="/user/info" />
      <van-cell title="收货地址" is-link to="/address" />
    </van-cell-group>
  </div>
</template>

<script>
import avatar from "../assets/avatar3.jpg";
import imgURL from "../utils/imgURL";

export default {
  name: "User",
  data() {
    return {
      avatar,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    imgURL,
  },
};
</script>

<style scoped>
.user {
  padding-bottom: 50px;
  min-height: calc(100vh - 50px);
}
.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
}
.user-card-username {
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>