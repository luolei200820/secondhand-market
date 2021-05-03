<template>
  <div class="leaving-message">
    <van-nav-bar
      fixed
      title="商品留言"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <div class="message-container" v-if="!loading && messageList.length">
      <message-card
        v-for="item in messageList"
        :key="item.id"
        :message="item"
      />
    </div>

    <van-empty
      v-if="!loading && !messageList.length"
      class="empty"
      description="还没有任何留言..."
    />

    <van-popup v-model="showMessagePopup" round position="bottom">
      <van-form ref="form">
        <van-field
          type="textarea"
          v-model="messageContent"
          label="留言"
          placeholder="输入留言"
          :rules="[{ required: true, message: '请输入留言内容' }]"
        />
        <div style="padding: 10px">
          <van-button
            round
            block
            type="info"
            size="small"
            @click="submitMessage"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <div class="btn-container">
      <van-button size="small" type="info" round block @click="showPopup">
        发表留言
      </van-button>
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
import MessageCard from "../../components/MessageCard.vue";

export default {
  name: "LeavingMessage",
  data() {
    return {
      loading: false,
      showMessagePopup: false,
      messageList: [],
      messageContent: "",
    };
  },
  methods: {
    async getMessageList() {
      try {
        this.loading = true;
        const res = await axios.get(
          `/leavingMessage/list?commodityId=${this.$route.params.id}`
        );
        this.loading = false;
        if (res.data.state === 1) {
          this.messageList = res.data.messageList;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    showPopup() {
      if (!this.$store.state.isLogin) {
        this.$toast.fail("您还没有登录");
        return;
      }
      this.showMessagePopup = true;
    },
    async submitMessage() {
      try {
        const res = await axios.post("/leavingMessage/add", {
          content: this.messageContent,
          commodityId: this.$route.params.id,
        });
        if (res.data.state === 1) {
          this.$toast.success("发表成功");
          this.showMessagePopup = false;
          this.getMessageList();
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
  created() {
    this.getMessageList();
  },
  components: {
    MessageCard,
  },
};
</script>

<style scoped>
.leaving-message {
  padding: 46px 0 50px;
  min-height: calc(100vh - 96px);
}
.empty {
  height: calc(100vh - 96px);
}
.message-container {
  padding: 10px;
}
.btn-container {
  position: fixed;
  bottom: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}
</style>