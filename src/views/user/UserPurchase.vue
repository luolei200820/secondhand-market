<template>
  <div class="user-purchase">
    <van-nav-bar
      fixed
      title="我买到的"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="purchase-list" v-if="!loading && purchaseList.length">
      <transaction-card
        v-for="item in purchaseList"
        :key="item.id"
        :record="item"
      >
      </transaction-card>
    </div>

    <van-empty
      v-if="!loading && !purchaseList.length"
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
      purchaseList: [],
    };
  },
  methods: {
    async getTransactionPurchase() {
      try {
        this.loading = true;
        const res = await axios.get("/transaction/purchase");
        this.loading = false;
        if (res.data.state === 1) {
          this.purchaseList = res.data.purchaseList;
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
    this.getTransactionPurchase();
  },
  components: { TransactionCard },
};
</script>

<style scoped>
.user-purchase {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
.purchase-list {
  padding: 10px;
}
</style>