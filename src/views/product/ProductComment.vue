<template>
  <div class="comment-list">
    <van-nav-bar
      fixed
      title="评论列表"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <div
      v-else
      class="comment-card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="comment-user">
        <van-image
          width="30"
          height="30"
          round
          :src="imgURL(comment.User.avatar) || defaultAvatar"
        ></van-image>
        <div style="margin-left: 10px">
          <div class="comment-user--username">
            {{ comment.User.username }}
          </div>
          <div class="comment-user--createdAt">
            {{ formatDate(comment.createdAt) }}
          </div>
        </div>
      </div>
      <div class="comment-text">
        {{ comment.text }}
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from "@/assets/avatar3.jpg";
import axios from "@/axios";
import imgURL from "@/utils/imgURL";

export default {
  data() {
    return {
      loading: false,
      comments: [],
      defaultAvatar,
    };
  },
  methods: {
    imgURL,
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    getComments() {
      this.loading = true;
      axios
        .get(`/comment/product/${this.$route.params.id}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.comments = res.data.comments;
            this.loading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络超时");
          console.log(err);
        });
    },
  },
  created() {
    this.getComments();
  },
};
</script>

<style scoped>
.comment-list {
  min-height: calc(100vh - 46px);
  padding-top: 46px;
}
.comment-card {
  padding: 20px 10px;
  background-color: white;
  border-bottom: 1px solid #ebedf0;
}
.comment-header {
  border-left: 4px solid #1989fa;
  margin-bottom: 10px;
}
.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.comment-user--username {
  font-size: 14px;
  font-weight: bolder;
}
.comment-user--createdAt {
  font-size: 12px;
  color: gray;
}
.comment-text {
  margin-top: 10px;
  font-size: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
</style>