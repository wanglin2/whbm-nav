<template>
  <div class="adContainer relative" v-if="config && show">
    <a
      :href="config.url ? config.url : 'javascript:void'"
      :target="config.url ? '_blank' : '_self'"
    >
      <img :src="config.img" alt="" />
    </a>
    <div
      class="iconBtn absolute flex items-center justify-center"
      @click.stop="close"
    >
      <i class="icon iconfont icon-guanbi"></i>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const config = computed(() => {
  return store.state.config ? store.state.config.whbm.ad : null;
});

const show = ref(true);

const close = () => {
  show.value = false;
};
</script>

<style lang="less" scoped>
.adContainer {
  width: 100%;
  height: 100px;
  margin-top: 20px;

  &:hover {
    .iconBtn {
      visibility: visible;
    }
  }

  .iconBtn {
    width: 30px;
    height: 30px;
    right: 10px;
    top: 10px;
    background-color: var(--other-light-color);
    border-radius: 2px;
    cursor: pointer;
    visibility: hidden;

    .icon {
      font-size: 20px;
      color: var(--other-dark-color);
    }
  }
}
</style>
