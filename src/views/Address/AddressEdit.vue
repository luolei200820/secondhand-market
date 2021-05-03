<template>
  <div class="address-add">
    <van-nav-bar
      fixed
      title="编辑收货地址"
      left-text="返回"
      right-text="删除"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="showConfirmDialog"
    />

    <van-loading color="#1989fa" class="loading" v-if="addressLoading">
      加载中...
    </van-loading>

    <van-form ref="form" v-if="!addressLoading && address">
      <van-field
        v-model="address.name"
        label="收件人"
        placeholder="请填写收货人姓名"
        :rules="[{ required: true, message: '请输入收件人名' }]"
      />
      <van-field
        v-model="address.phone"
        label="手机号码"
        placeholder="请填写收货人手机号码"
        :rules="[{ required: true, message: '请输入手机号码' }]"
      />
      <van-field
        v-model="address.area"
        is-link
        readonly
        label="所在地区"
        placeholder="省、市"
        :rules="[{ required: true, message: '请选择所在地' }]"
        @click="showArea = true"
      />
      <van-popup v-model="showArea" round position="bottom">
        <van-picker
          title="请选择所在地"
          show-toolbar
          :columns="areas"
          @confirm="onSelectArea"
          @cancel="showArea = false"
        />
      </van-popup>

      <van-field
        v-model="address.detail"
        autosize
        type="textarea"
        label="商品描述"
        placeholder="街道、楼牌号等"
        :rules="[{ required: true, message: '请输入详细地址' }]"
      />

      <van-field label="设置默认地址">
        <template #input>
          <van-switch v-model="address.default" size="20" />
        </template>
      </van-field>

      <div class="btn-container">
        <van-button
          class="btn-submit"
          round
          block
          type="info"
          size="small"
          @click="editAddress"
          :loading="loading"
        >
          提交
        </van-button>
      </div>
    </van-form>

    <van-empty
      image="network"
      v-if="!addressLoading && !address"
      description="网络错误"
    />
  </div>
</template>

<script>
import axios from "../../axios";
import areas from "../../data/categoris";

export default {
  name: "AddressEdit",
  data() {
    return {
      areas,
      loading: false,
      showArea: false,
      addressLoading: false,
      address: {
        name: "",
        phone: "",
        area: "",
        detail: "",
        default: false,
      },
    };
  },
  methods: {
    onSelectArea(value) {
      this.address.area = value.join("/");
      this.showArea = false;
    },
    async getAddress() {
      try {
        this.addressLoading = true;
        const res = await axios.get(`/address/${this.$route.params.id}`);
        this.addressLoading = false;
        if (res.data.state === 1) {
          this.address = res.data.address;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.addressLoading = false;
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async editAddress() {
      try {
        await this.$refs["form"].validate();
      } catch {
        return;
      }
      try {
        this.loading = true;
        const res = await axios.post("/address/edit", {
          address: this.address,
        });
        this.loading = false;
        if (res.data.state === 1) {
          this.$toast.success("修改成功");
          this.$router.go(-1);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
    async showConfirmDialog() {
      try {
        await this.$dialog.confirm({
          title: "是否删除地址",
        });
        const res = await axios.post("/address/delete", {
          id: this.address.id,
        });
        if (res.data.state === 1) {
          this.$toast.success("删除成功");
          this.$router.go(-1);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch {
        return;
      }
    },
  },
  created() {
    this.getAddress();
  },
};
</script>

<style scoped>
.address-add {
  min-height: calc(100vh - 46px);
  padding-top: 46px;
}
.btn-container {
  padding: 10px;
}
.btn-submit {
  margin: 0 auto;
  width: 70%;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
}
</style>