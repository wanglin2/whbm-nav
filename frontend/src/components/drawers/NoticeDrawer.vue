<template>
  <n-drawer v-model:show="drawerShow" :width="300">
    <n-drawer-content title="网站公告" closable>
      <div class="recommendBox h-full relative">
        <div
          class="listBox absolute w-full bottom-0"
          @scroll="checkBottomFn"
          ref="scrollEl"
        >
          <CardInfo
            v-for="item in listShow"
            :key="item.id"
            :list="item.list"
          ></CardInfo>
          <div class="tip text-center">{{ tip }}</div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { computed, ref, watch } from "vue";
import api from "@/api";
import { useLazyLoadList } from "@/hooks/lazyLoadList";
import CardInfo from "@c/CardInfo";

const useList = ({ drawerShow, getList, list }) => {
  const inited = ref(false);
  watch(drawerShow, (val) => {
    if (val && !inited.value) {
      inited.value = true;
      getList();
    }
  });
  const listShow = computed(() => {
    return list.value.map((item) => {
      return {
        ...item,
        list: [
          {
            name: "公告",
            value: item.itext,
          },
          {
            name: "公告",
            value: item.itime,
          },
        ],
      };
    });
  });

  return {
    listShow,
  };
};

const { drawerShow } = usrDrawer("noticeDrawer");
const { list, getList, scrollEl, checkBottomFn, tip } = useLazyLoadList({
  api: api.getNoticeList,
});
const { listShow } = useList({ drawerShow, getList, list });
</script>

<style lang="less" scoped>
.recommendBox {
  overflow: hidden;

  .listBox {
    bottom: 0;
    top: 0px;
    overflow: auto;

    .tip {
      color: var(--weak-dark-color);
    }
  }
}
</style>
