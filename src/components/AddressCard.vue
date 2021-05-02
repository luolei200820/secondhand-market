<template>
  <div class="address-card">
    <div class="address-card--mid">
      <div>
        {{ address.name }} {{ address.phone }}
        <van-tag type="primary" v-if="address.isDefault">默认</van-tag>
      </div>
      <div>{{ address.detail }}</div>
    </div>
    <div class="address-card--action">
      <van-icon name="edit" @click="$emit('clickEdit')" />
      <van-icon name="delete-o" @click="$emit('clickDelete')" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AddressCard",
  props: {
    address: Object,
  },
};
</script>

<style scoped>
.address-card {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
}
.address-card--mid {
  flex-grow: 1;
}
.address-card--action {
  flex-shrink: 0;
}
</style>