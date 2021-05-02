<template>
  <div>
    <van-nav-bar
      title="上传商品"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-form ref="form">
      <van-field
        v-model="product.title"
        label="标题"
        maxlength="30"
        placeholder="最大长度30个字符"
        :rules="[{ required: true, message: '请填写标题' }]"
      />
      <van-field
        v-model="product.price"
        type="number"
        label="价格"
        placeholder="请输入价格"
        :rules="[{ required: true }]"
      />

      <van-field
        v-model="product.category"
        is-link
        readonly
        label="分类"
        placeholder="请选择商品分类"
        @click="showCategory = true"
        :rules="[{ required: true }]"
      />
      <van-popup v-model="showCategory" round position="bottom">
        <van-picker
          title="分类"
          show-toolbar
          :columns="categories"
          @confirm="onSelectCategory"
          @cancel="showCategory = false"
        />
      </van-popup>

      <van-field
        v-model="product.transactionAddress"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        :rules="[{ required: true }]"
        @click="showArea = true"
      />
      <van-popup v-model="showArea" round position="bottom">
        <van-picker
          title="选择地区"
          show-toolbar
          :columns="areas"
          @confirm="onSelectArea"
          @cancel="showArea = false"
        />
      </van-popup>

      <van-field
        v-model="product.text"
        autosize
        type="textarea"
        label="商品描述"
        maxlength="200"
        show-word-limit
        :rules="[{ required: true, message: '请输入商品描述' }]"
      />

      <van-field
        name="uploader"
        label="商品主图"
        :rules="[{ required: true, message: '请至少上传商品主图' }]"
      >
        <template #input>
          <van-uploader
            :before-read="beforeRead"
            v-model="mainImg"
            :max-count="1"
          />
        </template>
      </van-field>

      <van-field name="uploader" label="详情图片">
        <template #input>
          <van-uploader
            :before-read="beforeRead"
            v-model="detailImgs"
            :max-count="6"
          />
        </template>
      </van-field>

      <div style="margin: 16px">
        <van-button round block type="info" @click="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import imageCompression from "browser-image-compression";
import categories from "@/data/categoris";
import areas from "@/data/areas.json";
import axios from "@/axios";

export default {
  name: "ProductUpload",
  data() {
    return {
      product: {
        title: "",
        transactionAddress: "",
        category: "",
        price: "",
      },
      mainImg: [],
      detailImgs: [],
      showArea: false,
      showCategory: false,
      loading: false,
      categories,
      areas,
    };
  },
  methods: {
    // 在读取图片前进行文件扩展名、大小检查，对超过200KB的图片进行压缩
    async beforeRead(file) {
      try {
        if (file.type !== "image/jpeg") {
          this.$toast("请选择jpg或jpeg格式的图片");
          return Promise.reject();
        } else if (file.size <= 200 * 1024) {
          // 文件小于200KB直接返回图片
          return file;
        } else {
          const blob = await imageCompression(file, { maxSizeMB: 0.2 });
          return new File([blob], file.name, { type: "image/jpeg" });
        }
      } catch (err) {
        console.error(err);
        return Promise.reject();
      }
    },
    // 选择一级、二级分类时将其用/分割组合成一个字符串
    onSelectCategory(value) {
      this.product.category = value.join("/");
      this.showCategory = false;
    },
    onSelectArea(value) {
      this.product.transactionAddress = value.join("/");
      this.showArea = false;
    },
    // 提交表单
    submit() {
      this.$refs["form"]
        .validate()
        .then(() => {
          this.loading = true;
          const form = new FormData();
          // 遍历product，向form对象中添加字段
          Object.keys(this.product).forEach((key) => {
            form.append(key, this.product[key]);
          });
          // 处理商品主图和详情图片
          form.append("mainImg", this.mainImg[0].file);
          this.detailImgs.forEach((item) => {
            form.append("detailImgs", item.file);
          });
          axios
            .post("/product/add", form)
            .then((res) => {
              if (res.data.state === 1) {
                this.$toast.success("上传成功");
                this.$router.push("/");
              } else {
                this.$toast.fail(res.data.msg);
              }
              this.loading = false;
            })
            .catch((err) => {
              this.$toast.fail("网络超时...");
              this.loading = false;
              console.log(err);
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
</style>