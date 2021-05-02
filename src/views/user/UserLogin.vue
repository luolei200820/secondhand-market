<template>
  <div>
    <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-form ref="login-form">
      <van-field
        v-model="loginForm.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="loginForm.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />

      <div style="padding: 0 16px">
        <span class="regist-user" @click="$router.push('/regist')">
          注册用户
        </span>
        <van-button :loading="loading" round block type="info" @click="login">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import axios from "../../axios";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        // 验证登录表单
        await this.$refs["login-form"].validate();
      } catch {
        // 验证失败结束loading，返回
        this.loading = false;
        return;
      }

      try {
        const res = await axios.post("/user/login", this.loginForm);
        if (res.data.state === 1) {
          // 弹出消息
          this.$toast("登录成功");
          // vuex设置登录，设置用户信息
          this.$store.commit("setLogin", res.data);
          // 配置axios的默认头部带上token
          axios.defaults.headers = {
            Authorization: `Bearer ${res.data.token}`,
          };
          // 在localStorage中保存token
          localStorage.setItem("token", `Bearer ${res.data.token}`);
          // 导航到首页
          this.$router.push("/");
        } else {
          // 状态非正常
          this.$toast(res.data.msg);
        }
      } catch {
        // 网络超时
        this.$toast("网络超时");
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.regist-user {
  display: block;
  padding: 10px;
  color: #1989fa;
  font-size: 14px;
  float: right;
}
</style>