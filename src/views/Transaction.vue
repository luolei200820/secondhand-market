<template>
  <div class="transaction">
    <van-nav-bar
      fixed
      title="确认购买"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <div class="transaction-info" v-else>
      <commodity-card :commodity="commodity"></commodity-card>
      <van-divider> 收货地址 </van-divider>
      <van-radio-group v-model="index">
        <address-card
          v-for="(item, index) in addressList"
          :key="item.id"
          :address="item"
        >
          <template v-slot:right-content>
            <van-radio :name="index" />
          </template>
        </address-card>
        <div class="empty" v-if="!addressList.length">
          还没有填写任何的收货地址
          <van-divider @click="$router.push('/address/add')">
            填写收货地址
          </van-divider>
        </div>
      </van-radio-group>
      <div class="btn-container">
        <van-button size="small" type="danger" round block @click="confirmBuy">
          确认购买
        </van-button>
      </div>

      <van-popup
        v-model="showInputPassword"
        round
        position="bottom"
        style="height: 300px; padding-top: 10px"
      >
        <van-password-input
          :value="payPassword"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
        <van-number-keyboard
          v-model="payPassword"
          :show="showKeyboard"
          theme="custom"
          maxlength="6"
          close-button-text="完成"
          @blur="showKeyboard = false"
          @close="submitTransaction"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import axios from "../axios";
import AddressCard from "../components/AddressCard.vue";
import CommodityCard from "../components/CommodityCard.vue";

export default {
  name: "Transaction",
  data() {
    return {
      loading: false,
      showInputPassword: false,
      showKeyboard: false,
      commodity: null,
      index: 0,
      addressList: [],
      payPassword: "",
    };
  },
  computed: {
    selectedAddress() {
      if (!this.addressList.length) return null;
      return this.addressList[this.index];
    },
  },
  methods: {
    async getCommodityDetail() {
      try {
        const res = await axios.get(
          `/commodity/${this.$route.query.commodityId}`
        );
        if (res.data.state === 1) {
          this.commodity = res.data.commodity;
          return Promise.resolve();
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async getAddress() {
      try {
        const res = await axios.get("/address/list");
        if (res.data.state === 1) {
          this.addressList = res.data.addressList;
          return Promise.resolve();
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    selectDefaultAddress() {
      let index = this.addressList.findIndex((item) => {
        return item.default === true;
      });
      if (index !== -1) {
        this.index = index;
      }
    },
    confirmBuy() {
      if (!this.selectedAddress) {
        this.$toast("请选择收货地址");
        return;
      }
      this.showInputPassword = true;
      this.showKeyboard = true;
    },
    async submitTransaction() {
      try {
        if (this.payPassword === "123456") {
          const res = await axios.post("/transaction", {
            commodityId: this.commodity.id,
            address: this.selectedAddress,
          });
          if (res.data.state === 1) {
            this.$toast.success("支付成功");
            this.showInputPassword = false;
            this.$router.go(-1);
          } else {
            this.$toast.fail(res.data.msg);
            this.showInputPassword = false;
          }
        } else {
          this.$toast.fail("密码错误");
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
  created() {
    this.loading = true;
    Promise.all([this.getCommodityDetail(), this.getAddress()]).then(() => {
      this.loading = false;
      this.selectDefaultAddress();
    });
  },
  components: { CommodityCard, AddressCard },
};
</script>

<style scoped>
.transaction {
  padding: 46px 0 50px;
}
.transaction-info {
  padding: 10px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 96px);
}
.title {
  font-size: 16px;
  margin: 10px 0;
}
.btn-container {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}
.empty {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
}
</style>