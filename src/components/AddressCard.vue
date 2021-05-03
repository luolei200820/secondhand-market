<template>
  <div class="card">
    <div class="left">
      <div>
        <van-tag type="primary" v-if="address.default">默认</van-tag>
        <span>{{ address.area }}</span>
      </div>
      <div class="address-detail">{{ address.detail }}</div>
      <div class="namePhone-container">
        <span class="address-name van-ellipsis">{{ address.name }}</span>
        <span class="address-phone">{{ address.phone }}</span>
      </div>
    </div>
    <div class="right">
      <slot name="right-content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    address: null,
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
  background-color: white;
  color: gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  font-size: 12px;
}
.left {
  flex-grow: 1;
}
.right {
  flex-shrink: 0;
}
.address-detail {
  font-size: 13px;
  font-weight: bold;
  color: black;
}
.address-name {
  display: inline-block;
  width: 60px;
}
</style>