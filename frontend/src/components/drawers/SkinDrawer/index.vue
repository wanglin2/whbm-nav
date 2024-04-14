<template>
  <n-drawer v-model:show="drawerShow" :width="400">
    <n-drawer-content title="主题定制" closable class="skinDrawerContent">
      <n-tabs type="line" :value="activeTab" :on-update:value="onTabChange">
        <n-tab-pane name="style" tab="背景"></n-tab-pane>
        <n-tab-pane name="setting" tab="设置"></n-tab-pane>
      </n-tabs>
      <Style v-if="activeTab === 'style'"></Style>
      <Setting v-else-if="activeTab === 'setting'"></Setting>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent, NTabs, NTabPane } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { ref } from "vue";
import Style from './Style';
import Setting from './Setting';

// tab
const useTab = () => {
  const activeTab = ref("style");
  const onTabChange = (value) => {
    activeTab.value = value;
  };

  return {
    onTabChange,
    activeTab,
  };
};

const { drawerShow } = usrDrawer("skinDrawer");
const { onTabChange, activeTab } = useTab();
</script>

<style lang="less" scoped>
/deep/.n-drawer-body {
  overflow: hidden;
}
</style>
