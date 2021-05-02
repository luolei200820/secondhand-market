<template>
  <div class="address-edit">
    <van-nav-bar
      title="编辑收货地址"
      left-text="返回"
      fixed
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading v-if="loading" color="#1989fa" size="24px" class="loading">
      加载中...
    </van-loading>

    <div v-else class="address-edit--form">
      <van-form class="address-edit--card" label-width="120px">
        <van-field
          label="姓名"
          v-model="address.name"
          :rules="[{ required: true, message: '请填写姓名' }]"
        ></van-field>
        <van-field
          label="手机号码"
          v-model="address.phone"
          :rules="[
            { required: true, message: '请填写手机号码' },
            {
              pattern: /^(13[0-9]|14[0-9]|15[0-9]|16[2|5|6|7]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
              message: '请填写正确的手机号码',
            },
          ]"
        ></van-field>
        <van-field
          label="地区"
          v-model="address.area"
          is-link
          readonly
          :rules="[{ required: true, message: '请选择所在地区' }]"
          @click="showArea = true"
        ></van-field>
        <van-field
          label="详细地址"
          v-model="address.detail"
          :rules="[{ required: true, message: '请填写详细地址' }]"
        ></van-field>
        <van-field
          label="邮政编码"
          v-model="address.postalCode"
          :rules="[{ required: true, message: '请填写邮政编码' }]"
        ></van-field>
        <van-field label="是否设为默认地址">
          <template #input>
            <van-switch v-model="address.isDefault" size="20" />
          </template>
        </van-field>
      </van-form>

      <van-button
        type="info"
        size="large"
        round
        :loading="btnLoading"
        style="height: 44px; margin-top: 10px"
        @click="submit"
      >
        提交
      </van-button>

      <van-popup v-model="showArea" round position="bottom">
        <van-picker
          title="选择地区"
          show-toolbar
          :columns="areas"
          @confirm="onSelectArea"
          @cancel="showArea = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import areas from "@/data/areas.json";
import axios from "@/axios";

export default {
  data() {
    return {
      areas,
      showArea: false,
      loading: false,
      btnLoading: false,
      address: null,
    };
  },
  methods: {
    onSelectArea(value) {
      this.address.area = value.join("/");
      this.showArea = false;
    },
    getAddress() {
      this.loading = true;
      axios
        .get(`/address/${this.$route.params.id}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.loading = false;
            this.address = res.data.address;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    submit() {
      this.btnLoading = true;
      axios
        .post("/address/edit", { address: this.address })
        .then((res) => {
          this.btnLoading = false;
          if (res.data.state === 1) {
            this.$toast.success("地址修改成功");
            this.$router.go(-1);
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
  },
  created() {
    this.getAddress();
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
.address-edit {
  min-height: calc(100vh - 56px);
  padding-top: 46px;
}
.address-edit--form {
  padding: 10px 10px 0;
}

.address-edit--card {
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
}
</style>