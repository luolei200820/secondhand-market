<template>
  <div class="upload">
    <van-nav-bar
      fixed
      title="上传商品"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-form ref="form" label-width="60px">
      <van-field
        v-model="commodity.title"
        label="标题"
        :rules="[{ required: true, message: '请填写标题' }]"
      />

      <van-field
        v-model="commodity.info"
        autosize
        type="textarea"
        label="商品描述"
        maxlength="200"
        show-word-limit
        :rules="[{ required: true, message: '请输入商品描述' }]"
      />

      <van-field
        v-model="commodity.area"
        is-link
        readonly
        label="地区"
        placeholder="省、市"
        :rules="[{ required: true }]"
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
        v-model="categoryName"
        is-link
        readonly
        label="分类"
        placeholder="请选择分类"
        :rules="[{ required: true }]"
        @click="showCategory = true"
      />
      <van-popup v-model="showCategory" round position="bottom">
        <van-picker
          title="选择地区"
          show-toolbar
          :columns="categories"
          @confirm="onSelectCategory"
          @cancel="showCategory = false"
        />
      </van-popup>

      <van-field
        v-model="commodity.price"
        type="number"
        label="价格"
        placeholder="请输入价格"
        :rules="[{ required: true }]"
      />

      <van-field
        label="商品主图"
        :rules="[{ required: true, message: '请至少上传商品主图' }]"
      >
        <template #input>
          <van-uploader
            :before-read="imageCompress"
            v-model="commodity.mainImg"
            :max-count="1"
          />
        </template>
      </van-field>

      <van-field label="详情图片">
        <template #input>
          <van-uploader
            :before-read="imageCompress"
            v-model="commodity.detailImgs"
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
import areas from "@/data/areas.json";
import imageCompress from "@/utils/imageCompress.js";
import axios from "../../axios";

export default {
  name: "Upload",
  data() {
    return {
      areas,
      showArea: false,
      showCategory: false,
      loading: false,
      loadingCategory: false,
      categories: [],
      commodity: {
        title: "",
        info: "",
        area: "",
        price: "",
        categoryId: 0,
        mainImg: [],
        detailImgs: [],
      },
      categoryName: "",
    };
  },
  methods: {
    onSelectArea(value) {
      this.commodity.area = value.join("/");
      this.showArea = false;
    },
    onSelectCategory(value) {
      this.commodity.categoryId = value.id;
      this.categoryName = value.text;
      this.showCategory = false;
    },
    imageCompress,
    async getCategories() {
      try {
        this.loadingCategory = true;
        const res = await axios.get("/category/list");
        this.loadingCategory = false;
        if (res.data.state === 1) {
          this.categories = res.data.categories.map((item) => {
            return {
              id: item.id,
              text: item.name,
            };
          });
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (err) {
        this.$toast.fail("获取分类失败");
        console.log(err);
      }
    },
    async submit() {
      try {
        await this.$refs["form"].validate();
      } catch {
        return;
      }
      try {
        const formData = new FormData();
        for (let i in this.commodity) {
          // 如果是图片
          if (Array.isArray(this.commodity[i])) {
            this.commodity[i].forEach((item) => {
              formData.append(i, item.file);
            });
          }
          // 其他文字字段
          else {
            formData.append(i, this.commodity[i]);
          }
        }
        const res = await axios.post("/commodity/add", formData);
        this.loading = false;
        if (res.data.state === 1) {
          this.$toast.success("上传成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch {
        this.loading = false;
        this.$toast.fail("网络错误");
        return;
      }
    },
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
.upload {
  padding-top: 46px;
  min-height: calc(100vh - 46px);
}
</style>