<template>
  <div class="headerContainer w-full flex items-center justify-between">
    <div class="left">
      <Logo></Logo>
    </div>
    <div class="center">
      <SearchInput v-if="showSearchInput"></SearchInput>
    </div>
    <div class="right">
      <User></User>
    </div>
  </div>
</template>

<script setup>
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import User from "./User";
import { defineProps } from "vue";

defineProps({
  showSearchInput: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="less" scoped>
.headerContainer {
  height: 120px;
}
</style>
