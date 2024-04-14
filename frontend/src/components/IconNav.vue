<template>
  <div class="moduleItemContainer w-full" ref="elContainer">
    <div class="navItem" v-for="(item, index) in list" :key="index">
      <a :href="item[0]" target="_blank">
        <img :src="item[1]" alt="" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useOpacityBackground } from "@/hooks/background";

const store = useStore();
const list = computed(() => {
  return store.state.config ? store.state.config.whbm.commonUsedSiteList : [];
});
const { elContainer } = useOpacityBackground();
</script>

<style lang="less" scoped>
.moduleItemContainer {
  overflow: hidden;
  padding: 10px 0px;
  border: 2px solid var(--dark-color);
  border-radius: 5px;

  .navItem {
    width: 145px;
    height: 55px;
    float: left;
    transition: all 0.3s ease;
    transform: scale(1);

    &:hover {
      transform: scale(1.05);
    }

    a {
      text-align: center;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: bold;
      text-decoration: none;

      img {
        vertical-align: middle;
        object-fit: scale-down;
        width: 70%;
        height: 70%;
      }
    }
  }
}
</style>
