<template>
  <div class="userinfo">
    <van-nav-bar
      fixed
      title="用户信息"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-form ref="form">
      <van-field
        label="头像"
        :rules="[{ required: true, message: '请选择头像' }]"
      >
        <template #input>
          <van-uploader
            :before-read="imageCompress"
            v-model="user.avatar"
            :max-count="1"
          />
        </template>
      </van-field>
      <van-field
        v-model="user.username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="user.email"
        label="邮箱"
        placeholder="邮箱"
        :rules="[
          { required: true, message: '请填写邮箱' },
          {
            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            message: '请输入正确的邮箱格式',
          },
        ]"
      />
      <van-field
        v-model="user.phone"
        label="电话"
        placeholder="电话"
        :rules="[
          { required: true, message: '请填写电话' },
          {
            pattern: /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
            message: '请输入正确的电话格式',
          },
        ]"
      />
      <div class="btn-container">
        <van-button
          round
          block
          size="small"
          type="info"
          @click="submit"
          :loading="loading"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import imageCompress from "../../utils/imageCompress";
import axios from "../../axios";
import imgURL from "../../utils/imgURL";

export default {
  name: "UserInfo",
  data() {
    return {
      loading: false,
      user: {
        avatar: [],
        username: "",
        email: "",
        phone: "",
      },
    };
  },
  methods: {
    imageCompress,
    copyUserInfo() {
      if (this.$store.state.user.avatar) {
        this.user.avatar.push({
          url: imgURL(this.$store.state.user.avatar),
        });
      }
      this.user.username = this.$store.state.user.username;
      this.user.email = this.$store.state.user.email;
      this.user.phone = this.$store.state.user.phone;
    },
    async submit() {
      try {
        await this.$refs["form"].validate();
      } catch {
        return;
      }
      try {
        const formDate = new FormData();
        formDate.append("username", this.user.username);
        formDate.append("email", this.user.email);
        formDate.append("phone", this.user.phone);
        if (this.user.avatar[0].file) {
          formDate.append("avatar", this.user.avatar[0].file);
        }
        this.loading = true;
        const res = await axios.post("/user/edit", formDate);
        this.loading = false;
        if (res.data.state === 1) {
          this.$toast.success("修改成功");
          this.$store.commit("setLogin", res.data.user);
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
  created() {
    this.copyUserInfo();
  },
};
</script>

<style scoped>
.userinfo {
  min-height: calc(100vh - 46px);
  padding-top: 46px;
}
.btn-container {
  padding: 10px;
}
</style>