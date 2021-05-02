<template>
  <div class="user-edit">
    <van-nav-bar
      title="个人信息设置"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-cell-group style="margin: 10px 0">
      <van-cell
        title="头像"
        center
        is-link
        @click="showChangeAvatarDialog = true"
      >
        <van-image
          :src="imgURL(user.avatar) || defaultAvatar"
          round
          width="60px"
          height="60px"
        ></van-image>
      </van-cell>
      <van-cell
        title="用户名"
        :value="user.username"
        is-link
        @click="showChangeUsernameDialog = true"
      />
    </van-cell-group>

    <van-dialog
      v-model="showChangeAvatarDialog"
      title="更换头像"
      show-cancel-button
      :beforeClose="confirmChangeAvatar"
    >
      <van-form ref="changeAvatarForm">
        <van-field :rules="[{ required: true, message: '请选择头像' }]">
          <template #input>
            <van-uploader
              :before-read="beforeRead"
              v-model="avatar"
              :max-count="1"
              class="avatar-uploader"
            ></van-uploader>
          </template>
        </van-field>
      </van-form>
    </van-dialog>

    <van-dialog
      v-model="showChangeUsernameDialog"
      title="修改用户名"
      show-cancel-button
      :beforeClose="confirmChangeUsername"
    >
      <van-form ref="changeUsernameForm">
        <van-field
          v-model="username"
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
        ></van-field>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/avatar3.jpg";
import imageCompression from "browser-image-compression";
import imgURL from "@/utils/imgURL";
import axios from "@/axios";

export default {
  data() {
    return {
      defaultAvatar,
      avatar: [],
      username: "",
      showChangeAvatarDialog: false,
      showChangeUsernameDialog: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    imgURL,
    usernameValidator(username) {
      const regex = /^[\x21-\x7E\u4E00-\u9FA5]{2,20}$/;
      return regex.test(username);
    },
    // 在读取图片前进行文件扩展名、大小检查，对超过200KB的图片进行压缩
    async beforeRead(file) {
      try {
        if (file.type !== "image/jpeg") {
          this.$toast("请选择jpg或jpeg格式的图片");
          return Promise.reject();
        } else if (file.size <= 200 * 1024) {
          // 文件小于200KB直接返回图片
          return file;
        } else {
          const blob = await imageCompression(file, { maxSizeMB: 0.2 });
          return new File([blob], file.name, { type: "image/jpeg" });
        }
      } catch (err) {
        console.error(err);
        return Promise.reject();
      }
    },
    // 确认修改头像
    confirmChangeAvatar(action, done) {
      if (action === "confirm") {
        this.$refs["changeAvatarForm"]
          .validate()
          .then(() => {
            const form = new FormData();
            form.append("avatar", this.avatar[0].file);
            axios
              .post("/user/change-avatar", form)
              .then((res) => {
                if (res.data.state === 1) {
                  this.$toast.success("头像修改成功");
                  this.$store.commit("setUserAvatar", res.data.avatar);
                  done();
                } else {
                  this.$toast.fail(res.data.msg);
                  done(false);
                }
              })
              .catch((err) => {
                this.$toast.fail("网络错误");
                done(false);
                console.log(err);
              });
          })
          .catch(() => {
            done(false);
          });
      } else {
        done();
      }
    },
    // 确认修改用户名
    confirmChangeUsername(action, done) {
      if (action === "confirm") {
        this.$refs["changeUsernameForm"]
          .validate()
          .then(() => {
            axios
              .post("/user/change-username", { username: this.username })
              .then((res) => {
                if (res.data.state === 1) {
                  this.$toast.success("用户名修改成功");
                  this.$store.commit("setUserUsername", res.data.username);
                  done();
                } else {
                  this.$toast.fail(res.data.msg);
                  done(false);
                }
              })
              .catch((err) => {
                this.$toast.fail("网络错误");
                done(false);
                console.log(err);
              });
          })
          .catch(() => {
            done(false);
          });
      } else {
        done();
      }
    },
  },
};
</script>

<style scoped>
.user-edit {
  min-height: 100vh;
}
.avatar-uploader {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  width: 100%;
}
</style>