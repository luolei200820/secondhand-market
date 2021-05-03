<template>
  <div class="commodity-search">
    <van-search
      class="search"
      placeholder="输入搜索关键字"
      shape="round"
      show-action
      v-model="searchValue"
      @search="onSearch"
    >
      <template v-slot:left>
        <van-icon name="arrow-left" @click="$router.go(-1)" />
      </template>
    </van-search>

    <div class="commodityList">
      <van-loading color="#1989fa" class="loading" v-if="loading">
        加载中...
      </van-loading>

      <van-row gutter="5" v-if="!loading && commodities.length">
        <van-col
          span="12"
          v-for="item in commodities"
          :key="item.id"
          @click="$router.push(`/commodity/${item.id}`)"
        >
          <commodity-card :commodity="item"></commodity-card>
        </van-col>
      </van-row>

      <van-empty
        v-if="!loading && !commodities.length"
        class="empty"
        image="error"
        description="网络错误或者还没有任何商品"
      />
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
import CommodityCard from "../../components/CommodityCard";
export default {
  data() {
    return {
      searchValue: "",
      loading: false,
      commodities: [],
    };
  },
  methods: {
    async onSearch() {
      try {
        this.loading = true;
        const res = await axios.post("/commodity/search", {
          title: this.searchValue,
        });
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
    async getCommodityListByCategory() {
      try {
        this.loading = true;
        const res = await axios.get(
          `/commodity/category?id=${this.$route.query.categoryId}`
        );
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
  },
  created() {
    this.getCommodityListByCategory();
  },
  components: {
    CommodityCard,
  },
};
</script>

<style scoped>
.commodity-search {
  padding-top: 54px;
  min-height: calc(100vh - 54px);
}
.search {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 124px);
}
.empty {
  height: calc(100vh - 124px);
}
.commodityList {
  padding: 10px;
}
</style>