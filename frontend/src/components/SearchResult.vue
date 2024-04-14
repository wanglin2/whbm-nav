<template>
  <div class="searchResultContainer" v-if="searchResultList !== null">
    <SiteListBlock
      icon="icon-sousuo"
      style="margin-bottom: 12px"
      title="搜索结果"
      noDataTip="啥也没搜到~"
      titleBackground="#18a058"
      :canDrag="false"
      :list="searchResultList"
      :showCloseBtn="true"
      @close="onClose"
    ></SiteListBlock>
  </div>
</template>

<script setup>
import SiteListBlock from "./SiteListBlock";
import { ref, watch } from "vue";
import { useStore } from "vuex";

// 初始化
const useInit = () => {
  const store = useStore();

  return {
    store,
  };
};

// 搜索结果
const useSearch = ({ store }) => {
  const searchResultList = ref(null);
  watch(
    () => {
      return store.state.searchResultList;
    },
    (val) => {
      if (val) {
        searchResultList.value = [...val];
      }
    }
  );

  const onClose = () => {
    searchResultList.value = null
  }

  return {
    searchResultList,
    onClose
  };
};

const { store } = useInit();
const { searchResultList, onClose } = useSearch({ store });
</script>

<style lang="less" scoped>
.searchResultContainer {
}
</style>
