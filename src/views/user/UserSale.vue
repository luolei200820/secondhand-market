<template>
  <div class="user-sale">
    <van-nav-bar
      fixed
      title="我卖出的"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="sale-list" v-if="!loading && saleList.length">
      <transaction-card
        v-for="item in saleList"
        :key="item.id"
        :record="item"
      >
      </transaction-card>
    </div>

    <van-empty
      v-if="!loading && !saleList.length"
      image="error"
      description="网络错误或者还没有任何购买记录"
    />
  </div>
</template>

<script>
import TransactionCard from "../../components/TransactionCard.vue";
import axios from "../../axios";

export default {
  data() {
    return {
      loading: false,
      saleList: [],
    };
  },
  methods: {
    async getTransactionSale() {
      try {
        this.loading = true;
        const res = await axios.get("/transaction/sale");
        this.loading = false;
        if (res.data.state === 1) {
          this.saleList = res.data.saleList;
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
    this.getTransactionSale();
  },
  components: { TransactionCard },
};
</script>

<style scoped>
.user-sale {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.sale-list {
  padding: 10px;
}
</style>