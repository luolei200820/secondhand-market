<template>
  <div class="login">
    <van-nav-bar
      fixed
      title="用户登录"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-form>
      <van-field
        v-model="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div class="btn-submit">
        <van-button round block type="info" @click="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import axios from "../axios";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
    };
  },
  methods: {
    async submit() {
      try {
        this.loading = true;
        const res = await axios.post("/user/login", {
          username: this.username,
          password: this.password,
        });
        this.loading = false;
        if (res.data.state === 1) {
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common["Authorization"] = res.data.token;
          this.$store.commit("setLogin");
          this.$store.commit("setUser", res.data.user);
          this.$store.commit("setShoppingCart", res.data.shoppingCartItemList);
          this.$router.go(-1);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.login {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.btn-submit {
  padding: 10px;
}
</style>