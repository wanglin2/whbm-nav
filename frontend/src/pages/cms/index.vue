<template>
  <n-message-provider>
    <div class="content">
      <div class="block">
        <RegisterApplet></RegisterApplet>
      </div>
      <div class="block">
        <SiteList></SiteList>
      </div>
    </div>
  </n-message-provider>
</template>

<script setup>
import RegisterApplet from "./components/RegisterApplet.vue";
import { NMessageProvider } from "naive-ui";
import SiteList from './components/SiteList.vue';
</script>

<style lang="less" scoped>
.content {
  width: 800px;
  margin: 50px auto;

  .block {
    h1 {
      margin-bottom: 30px;
      font-weight: bold;
    }
  }
}
</style>