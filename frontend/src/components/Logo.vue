<template>
  <div class="logoContainer h-full">
    <img class="img" :src="logoImg" alt="" />
  </div>
</template>

<script setup>
import { ref } from "vue";
const logo = require("../assets/images/logo.png");

const logoImg = ref(logo);
</script>

<style lang="less" scoped>
.logoContainer {
  .img {
    height: 80px;
  }
}
</style>
