<template>
  <div class="address-list">
    <van-nav-bar
      title="我的收货地址"
      left-text="返回"
      fixed
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <div v-else class="address-list--body">
      <address-card
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        @clickEdit="$router.push(`/user/address/edit/${address.id}`)"
        @clickDelete="deleteAddress(address.id)"
      ></address-card>

      <van-button
        class="add-btn"
        size="large"
        type="info"
        round
        @click="$router.push('/user/address/add')"
      >
        新增收货地址
      </van-button>
    </div>
  </div>
</template>

<script>
import AddressCard from "@/components/AddressCard.vue";
import axios from "@/axios";

export default {
  data() {
    return {
      loading: false,
      addresses: [],
    };
  },
  methods: {
    getAddressList() {
      this.loading = true;
      axios
        .get("/address/list")
        .then((res) => {
          if (res.data.state === 1) {
            this.addresses = res.data.addresses;
            this.loading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    deleteAddress(id) {
      this.$dialog
        .confirm({
          message: "确认删除此地址吗",
        })
        .then(() => {
          axios
            .post("/address/delete", { id })
            .then((res) => {
              if (res.data.state === 1) {
                this.$toast.success("删除成功");
                // 从当前的列表中删除此地址
                let index = this.addresses.findIndex((item) => {
                  return item.id === id;
                });
                if (index !== -1) {
                  this.addresses.splice(index, 1);
                }
              } else {
                this.$toast.fail(res.data.msg);
              }
            })
            .catch((err) => {
              this.$toast.fail("网络错误");
              console.log(err);
            });
        })
        .catch(() => {});
    },
  },
  created() {
    this.getAddressList();
  },
  components: {
    AddressCard,
  },
};
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
.address-list {
  min-height: calc(100vh - 56px);
  padding-top: 46px;
}
.address-list--body {
  padding: 10px 10px 0;
}
.add-btn {
  height: 42px;
}
</style>