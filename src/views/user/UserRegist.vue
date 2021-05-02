<template>
  <div>
    <van-nav-bar
      title="注册"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-form ref="regist-form">
      <van-field
        v-model="registForm.username"
        label="用户名"
        placeholder="长度2-20 支持英文/符号/汉字"
        maxlength="20"
        :rules="[
          { required: true, message: '请填写用户名' },
          {
            validator: usernameValidator,
            message: '未正确输入用户名',
          },
        ]"
      />
      <van-field
        v-model="registForm.password"
        type="password"
        label="密码"
        maxlength="18"
        placeholder="长度6-18 支持英文/数字/特殊符号"
        :rules="[
          { required: true, message: '请填写密码' },
          {
            validator: passwordValidator,
            message: '未正确输入密码',
          },
        ]"
      />
      <van-field
        v-model="registForm.password2"
        type="password"
        label="确认密码"
        maxlength="18"
        placeholder="请再次输入密码"
        :rules="[
          {
            validator: password2Validator,
            message: '两次输入的密码不一致',
          },
        ]"
      />
      <div style="padding: 0 16px; margin-top: 20px">
        <van-button :loading="loading" round block type="info" @click="regist">
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
      loading: false,
      registForm: {
        username: "",
        password: "",
        password2: "",
      },
    };
  },
  methods: {
    async regist() {
      this.loading = true;
      try {
        // 验证注册表单规则
        await this.$refs["regist-form"].validate();
      } catch {
        this.loading = false;
        return;
      }

      try {
        const res = await axios.post("/user/regist", this.registForm);
        if (res.data.state === 1) {
          // 弹出消息
          this.$toast("注册成功");
          // vuex设置登录
          this.$store.commit("setLogin", res.data);
          // 配置axios的默认头部带上token
          axios.defaults.headers = {
            Authorization: `Bearer ${res.data.token}`,
          };
          // 在localStorage保存token
          localStorage.setItem("token", `Bearer ${res.data.token}`);
          this.$router.push("/");
        } else {
          this.$toast(res.data.msg);
        }
      } catch {
        this.$toast("网络超时");
      }
      this.loading = false;
    },
    usernameValidator(username) {
      const regex = /^[\x21-\x7E\u4E00-\u9FA5]{2,20}$/;
      return regex.test(username);
    },
    passwordValidator(password) {
      const regex = /^[\x21-\x7E]{6,18}$/;
      return regex.test(password);
    },
    password2Validator(password2) {
      return this.registForm.password === password2;
    },
  },
};
</script>

<style scoped>
.link-button {
  display: block;
  padding: 10px;
  color: #1989fa;
  font-size: 14px;
  float: right;
}
</style>