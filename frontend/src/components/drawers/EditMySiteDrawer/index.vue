<template>
  <n-drawer v-model:show="drawerShow" :width="600">
    <n-drawer-content title="管理我的导航" closable>
      <n-tabs type="line" :value="activeTab" :on-update:value="onTabChange">
        <n-tab-pane name="mySite" tab="我的空间"></n-tab-pane>
        <n-tab-pane name="myClass" tab="我的分类"></n-tab-pane>
        <n-tab-pane name="myClassSite" tab="我的分类网站"></n-tab-pane>
      </n-tabs>
      <EditMySite v-if="activeTab === 'mySite'"></EditMySite>
      <EditMyClass v-else-if="activeTab === 'myClass'"></EditMyClass>
      <EditMyClassSite
        v-else-if="activeTab === 'myClassSite'"
      ></EditMyClassSite>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent, NTabs, NTabPane } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { ref } from "vue";
import EditMySite from "./EditMySite";
import EditMyClass from "./EditMyClass";
import EditMyClassSite from "./EditMyClassSite";

// tab
const useTab = () => {
  const activeTab = ref("mySite");
  const onTabChange = (value) => {
    activeTab.value = value;
  };

  return {
    onTabChange,
    activeTab,
  };
};

const { drawerShow } = usrDrawer("editMySiteDrawer");
const { onTabChange, activeTab } = useTab();
</script>

<style lang="less" scoped>
/deep/.n-drawer-body {
  overflow: hidden;
}

.btnRow {
  margin-bottom: 10px;

  .tip {
    margin-left: 5px;
    color: var(--weak-dark-color);
  }
}
</style>
