<template>
  <div class="container" :style="{ width: (config.width || 450) + 'px' }">
    <App></App>
  </div>
</template>

<script setup>
import App, { config } from "@/applets/music";
</script>

<style lang="less" scoped>
.container {
	position: absolute;
  height: 100%;
	border: 1px solid #000;
	left: 50%;
	transform: translateX(-50%);
}
</style>