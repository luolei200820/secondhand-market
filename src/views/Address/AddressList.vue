<template>
  <div class="address">
    <van-nav-bar
      fixed
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading color="#1989fa" class="loading" v-if="loading">
      加载中...
    </van-loading>

    <div class="address-list" v-else>
      <address-card v-for="item in addressList" :key="item.id" :address="item">
        <template v-slot:right-content>
          <van-icon
            name="edit"
            class="address-edit-icon"
            @click="$router.push(`/address/edit/${item.id}`)"
          />
        </template>
      </address-card>
    </div>

    <van-empty
      description="还没有任何收货地址"
      v-if="!loading && !addressList.length"
    />

    <div class="btn-container">
      <van-button
        class="btn-addAddress"
        type="info"
        size="small"
        round
        icon="plus"
        @click="$router.push('/address/add')"
      >
        添加收货地址
      </van-button>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import AddressCard from "@/components/AddressCard.vue";

export default {
  name: "AddressList",
  data() {
    return {
      loading: false,
      addressList: [],
    };
  },
  methods: {
    async getAddress() {
      try {
        this.loading = true;
        const res = await axios.get("/address/list");
        this.loading = false;
        if (res.data.state === 1) {
          this.addressList = res.data.addressList;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
  },
  created() {
    this.getAddress();
  },
  components: {
    AddressCard,
  },
};
</script>

<style scoped>
.address {
  min-height: calc(100vh - 46px);
  padding-top: 46px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
.address-list {
  padding: 10px;
}
.address-edit-icon {
  font-size: 14px;
  color: black;
}
.btn-container {
  padding: 10px;
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
}
.btn-addAddress {
  width: 100%;
}
</style>