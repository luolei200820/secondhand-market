<template>
  <div class="category">
    <van-nav-bar
      fixed
      title="商品分类"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <van-grid :column-num="3" v-if="!loading && categories.length">
      <van-grid-item
        v-for="item in categories"
        :key="item.id"
        @click="$router.push(`/commodity/search?categoryId=${item.id}`)"
      >
        <van-image :src="imgURL(item.image)" width="50" height="50" />
        <span class="category-name">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>

    <van-empty
      v-if="!loading && !categories.length"
      class="empty"
      image="error"
      description="网络错误或者还没有任何分类"
    />
  </div>
</template>

<script>
import axios from "../axios";
import imgURL from "../utils/imgURL";

export default {
  name: "Category",
  data() {
    return {
      loading: false,
      categories: [],
    };
  },
  methods: {
    async getCategories() {
      try {
        this.loading = true;
        const res = await axios.get("/category/list");
        this.loading = false;
        if (res.data.state === 1) {
          this.categories = res.data.categories;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.loading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    imgURL,
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
.category {
  min-height: calc(100vh - 96px);
  padding: 46px 0 50px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 96px);
}
.category-name {
  font-size: 12px;
}
.empty {
  height: calc(100vh - 96px);
}
</style>