<template>
  <div>
    <van-nav-bar
      title="编辑商品"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-loading
      v-if="productLoading"
      color="#1989fa"
      size="24px"
      class="loading"
    >
      加载中...
    </van-loading>

    <van-form v-else ref="form">
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
        <van-button
          round
          block
          type="info"
          @click="submit"
          :loading="submitLoading"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import imageCompression from "browser-image-compression";
import categories from "../../data/categoris";
import imgURL from "../../utils/imgURL";
import areas from "../../data/areas.json";
import axios from "../../axios";

export default {
  name: "ProductEdit",
  data() {
    return {
      productLoading: false,
      product: null,
      showArea: false,
      showCategory: false,
      submitLoading: false,
      categories,
      areas,
    };
  },
  computed: {
    mainImg: {
      get() {
        if (typeof this.product.mainImg === "string") {
          return [{ url: this.imgURL(this.product.mainImg) }];
        } else {
          return this.product.mainImg;
        }
      },
      set(val) {
        this.product.mainImg = val;
      },
    },
    detailImgs: {
      get() {
        if (this.product.detailImgs) {
          if (typeof this.product.detailImgs === "string") {
            return this.product.detailImgs.split(",").map((filename) => {
              return {
                url: this.imgURL(filename),
                filename,
              };
            });
          } else {
            return this.product.detailImgs;
          }
        } else {
          return [];
        }
      },
      set(val) {
        this.product.detailImgs = val;
      },
    },
  },
  methods: {
    imgURL,
    getProduct(productId) {
      this.productLoading = true;
      axios
        .get(`/product/edit-info/?id=${productId}`)
        .then((res) => {
          if (res.data.state === 1) {
            this.product = res.data.product;
            this.productLoading = false;
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    },
    // 在读取图片前进行文件扩展名、大小检查，对超过200KB的图片进行压缩
    beforeRead(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== "image/jpeg") {
          this.$toast("请选择jpg或jpeg格式的图片");
          reject();
        } else if (file.size <= 200 * 1024) {
          // 文件小于200KB直接返回图片
          resolve(file);
        } else {
          imageCompression(file, { maxSizeMB: 0.2 })
            .then((blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        }
      });
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
          this.submitLoading = true;
          const form = new FormData();
          form.append("id", this.product.id);
          form.append("title", this.product.title);
          form.append("price", this.product.price);
          form.append("category", this.product.category);
          form.append("transactionAddress", this.product.transactionAddress);
          form.append("text", this.product.text);
          if (typeof this.product.mainImg !== "string") {
            // 主图修改了
            form.append("mainImg", this.product.mainImg[0].file);
          }

          if (typeof this.product.detailImgs === "string") {
            // 详情图片未修改
            let arrayOfFilename = this.product.detailImgs.split(",");
            arrayOfFilename.forEach((filename) => {
              form.append("detailImgs", filename);
            });
          } else {
            // 详情图片修改了
            this.detailImgs.forEach((item) => {
              form.append("detailImgs", item.filename || item.file);
            });
          }
          axios
            .post("/product/edit", form)
            .then((res) => {
              this.submitLoading = false;
              if (res.data.state === 1) {
                this.$toast.success("修改成功");
                this.$router.go(-1);
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
    this.getProduct(this.$route.params.id);
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
</style>