<template>
  <div>
    <div class="user-card">
      <van-image
        width="60px"
        height="60px"
        round
        :src="imgURL(user.avatar) || defaultAvatar"
      ></van-image>
      <div style="padding: 0 20px">
        <div class="user-name">{{ user.username }}</div>
        <div class="user-signature">个人签名...</div>
      </div>
    </div>

    <van-grid :column-num="3">
      <van-grid-item
        icon="bag-o"
        text="我发布的"
        @click="$router.push('/user/product-manage')"
      />
      <van-grid-item
        icon="after-sale"
        text="我卖出的"
        @click="$router.push('/user/product-sold')"
      />
      <van-grid-item
        icon="orders-o"
        text="我买到的"
        @click="$router.push('/user/order')"
      />
    </van-grid>

    <van-cell-group style="margin: 10px 0">
      <van-cell title="个人信息设置" is-link to="/user/info"></van-cell>
      <van-cell title="编辑收货地址" is-link to="/user/address"></van-cell>
    </van-cell-group>

    <div style="padding: 0 10px">
      <van-button block type="danger" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/avatar3.jpg";
import imgURL from "@/utils/imgURL";

export default {
  data() {
    return {
      defaultAvatar,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    imgURL,
    async logout() {
      try {
        await this.$dialog.confirm({ message: "确认退出登录？" });
      } catch {
        return;
      }
      this.$router.push("/");
      this.$store.commit("setLogout");
      localStorage.removeItem("token");
    },
  },
};
</script>

<style scoped>
.user-card {
  display: flex;
  padding: 20px;
  height: 60px;
  background-color: white;
}
.user-name {
  font-size: 22px;
  font-weight: bold;
}
.user-signature {
  font-size: 10px;
  color: gray;
}
</style>