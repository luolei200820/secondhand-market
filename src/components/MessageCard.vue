<template>
  <div class="message-card">
    <div class="user">
      <van-image
        fit="cover"
        width="30"
        height="30"
        round
        :src="imgURL(message.User.avatar) || avatar"
        class="user-avatar"
      ></van-image>
      <div class="user-info">
        <div>{{ message.User.username }}</div>
        <div>发布时间：{{ formatDate(message.createdAt) }}</div>
      </div>
    </div>
    <div class="message-content">
      {{ message.content }}
    </div>
  </div>
</template>

<script>
import imgURL from "../utils/imgURL";
import avatar from "../assets/avatar3.jpg";
import moment from "moment";
moment.locale("zh-cn");

export default {
  name: "MessageCard",
  props: {
    message: Object,
  },
  data() {
    return {
      avatar,
    };
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
.message-card {
  border-radius: 10px;
  background-color: white;
  font-size: 12px;
  padding: 10px;
  margin-bottom: 5px;
}
.user {
  display: flex;
}
.user-avatar {
  flex-shrink: 0;
}
.user-info {
  flex-grow: 1;
  margin-left: 10px;
}
.message-content {
  padding: 10px 0 10px 40px;
}
</style>