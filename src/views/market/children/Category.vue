<template>
  <div>
    <van-nav-bar title="分类" fixed z-index="2" />
    <van-sidebar v-model="index" class="first-category">
      <van-sidebar-item
        v-for="item in categories"
        :key="item.text"
        :title="item.text"
      />
    </van-sidebar>

    <div class="right-container">
      <van-grid :column-num="3">
        <van-grid-item
          v-for="item in categories[index].children"
          :key="item.text"
          @click="$router.push(`/product/search?keyword=${item.text}`)"
        >
          <!-- <van-image :src="categoryUrl(item.img)" /> -->
          <div class="category-name">{{ item.text }}</div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import categories from "@/data/categoris";
export default {
  data() {
    return {
      index: 0,
      categories,
    };
  },
};
</script>

<style scoped>
.first-category {
  position: fixed;
  top: 46px;
  min-height: calc(100vh - 96px);
  background-color: #f7f8fa;
}
.right-container {
  padding: 46px 0 0 80px;
}
.category-name {
  font-size: 12px;
  color: #303133;
}
</style>