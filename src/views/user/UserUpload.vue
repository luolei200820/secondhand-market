<template>
  <div class="user-upload">
    <van-nav-bar
      fixed
      title="我发布的"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="upload-list" v-if="!loading && commodities.length">
      <upload-item v-for="item in commodities" :commodity="item" :key="item.id">
        <template #action>
          <van-button
            size="small"
            @click="$router.push(`/commodity/${item.id}`)"
          >
            查看
          </van-button>
          <van-button size="small" @click="showDeleteConfirm(item.id)">
            删除
          </van-button>
        </template>
      </upload-item>
    </div>

    <van-empty
      v-if="!loading && !commodities.length"
      image="error"
      description="网络错误或者还没有任何购买记录"
    />
  </div>
</template>

<script>
import axios from "../../axios";
import UploadItem from "../../components/UploadItem.vue";

export default {
  data() {
    return {
      loading: false,
      commodities: [],
    };
  },
  methods: {
    async getUserUpload() {
      try {
        this.loading = true;
        const res = await axios.get("/commodity/user-upload");
        this.loading = false;
        if (res.data.state === 1) {
          this.commodities = res.data.commodities;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async showDeleteConfirm(id) {
      try {
        await this.$dialog.confirm({
          title: "是否删除此商品",
        });
        const res = await axios.post("/commodity/delete", { id });
        if (res.data.state === 1) {
          this.$toast.success("删除成功");
          let index = this.commodities.findIndex((item) => {
            return item.id === id;
          });
          if (index != -1) {
            this.commodities.splice(index, 1);
          }
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch {
        return;
      }
    },
  },
  created() {
    this.getUserUpload();
  },
  components: {
    UploadItem,
  },
};
</script>

<style scoped>
.user-upload {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.upload-list {
  padding: 10px;
}
</style>