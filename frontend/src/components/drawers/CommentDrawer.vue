<template>
  <n-drawer v-model:show="drawerShow" :width="500">
    <n-drawer-content title="留言" closable>
      <div class="commentContainer">
        <div class="wlcomit" data-id="whbm_2.0" data-url=""></div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { usrDrawer } from "@/hooks/drawer";
import { watch, onMounted } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";
import { loadJsResource } from "@/utils";

const { drawerShow } = usrDrawer("commentDrawer");
let inited = false;
onMounted(() => {
  watch(drawerShow, async (val) => {
    if (val && !inited) {
      await loadJsResource(
        process.env.NODE_ENV === "development"
          ? "http://lxqnsys.com/content/wlmtplus/comit/wlcomit.js?v1"
          : "../content/wlmtplus/comit/wlcomit.js?v1"
      );
      inited = true;
    }
  });
});
</script>

<style lang="less" scoped>
/deep/.n-drawer-body {
  overflow: hidden;
}

.commentContainer {
}
</style>
