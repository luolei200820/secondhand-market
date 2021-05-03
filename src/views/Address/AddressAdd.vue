<template>
  <div class="address-add">
    <van-nav-bar
      fixed
      title="添加收货地址"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-form ref="form">
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
          @click="addAddress"
          :loading="loading"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import axios from "@/axios";
import areas from "@/data/areas.json";

export default {
  name: "AddressAdd",
  data() {
    return {
      areas,
      loading: false,
      showArea: false,
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
    async addAddress() {
      try {
        await this.$refs["form"].validate();
      } catch {
        return;
      }
      try {
        this.loading = true;
        const res = await axios.post("/address/add", { address: this.address });
        this.loading = false;
        if (res.data.state === 1) {
          this.$toast.success("添加成功");
          this.$router.go(-1);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("网络错误");
        console.log(err);
      }
    },
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
</style>