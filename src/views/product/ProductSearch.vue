<template>
  <div class="product-search">
    <van-search class="search" shape="round" show-action v-model="searchValue">
      <template #left>
        <van-icon name="arrow-left" @click="$router.go(-1)" />
      </template>
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <van-dropdown-menu class="filter">
      <van-dropdown-item v-model="option1" :options="options1" />
      <van-dropdown-item v-model="option2" :options="options2" />
    </van-dropdown-menu>

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <van-row v-else gutter="10" class="product-list">
      <van-col span="12" v-for="item in products" :key="item.id">
        <div class="product-card" @click="$router.push(`/product/${item.id}`)">
          <van-image
            class="product-img"
            height="170px"
            fit="cover"
            lazy-load
            :src="imgURL(item.mainImg)"
          ></van-image>

          <div class="product-card--body">
            <div class="product-title van-multi-ellipsis--l2">
              {{ item.title }}
            </div>

            <div class="product-price--container">
              <div class="product-price van-ellipsis">{{ item.price }}</div>
              <div class="product-wanted">{{ item.wanted }}人想要</div>
            </div>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import axios from "../../axios";
import imgURL from "../../utils/imgURL";

export default {
  data() {
    return {
      searchValue: "",
      loading: false,
      products: [],
      option1: 0,
      option2: 0,
      options1: [{ text: "全部商品", value: 0 }],
      options2: [
        { text: "默认排序", value: 0 },
        { text: "人气升序", value: 1 },
        { text: "人气降序", value: 2 },
        { text: "价格升序", value: 3 },
        { text: "价格降序", value: 4 },
      ],
    };
  },
  watch: {
    option2(val) {
      switch (val) {
        case 1:
          //人气升序
          this.products.sort((a, b) => {
            return a.wanted - b.wanted;
          });
          break;
        case 2:
          //人气降序
          this.products.sort((a, b) => {
            return b.wanted - a.wanted;
          });
          break;
        case 3:
          //价格升序
          this.products.sort((a, b) => {
            return parseFloat(a.price) - parseFloat(b.price);
          });
          break;
        default:
          //价格降序
          this.products.sort((a, b) => {
            return parseFloat(b.price) - parseFloat(a.price);
          });
          break;
      }
    },
  },
  methods: {
    imgURL,
    onSearch() {
      this.loading = true;
      axios
        .get(`/product/search?keyword=${this.searchValue}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.products = res.data.products;
            this.loading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("服务器正忙...");
          console.log(err);
        });
    },
    getProduct(keyword) {
      this.loading = true;
      axios
        .get(`/product/search?keyword=${keyword}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.products = res.data.products;
            this.loading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("服务器正忙...");
          console.log(err);
        });
    },
  },
  created() {
    this.getProduct(this.$route.query.keyword);
  },
};
</script>

<style scoped>
.product-search {
  padding-top: 102px;
}
.search {
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
}
.filter {
  position: fixed;
  top: 54px;
  z-index: 1;
  width: 100%;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 102px);
}

.product-list {
  margin-top: 20px;
  padding: 0 10px;
}

.product-card {
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: white;
}
.product-card--body {
  padding: 10px;
}
.product-img {
  display: block;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}
.product-title {
  font-size: 16px;
  height: 42px;
  overflow: hidden;
}
.product-price--container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-price {
  color: orangered;
  font-size: 16px;
  font-weight: 600;
}
.product-price::before {
  content: "￥";
  font-size: 10px;
}
.product-wanted {
  flex-shrink: 0;
  font-size: 12px;
  color: gray;
}
</style>