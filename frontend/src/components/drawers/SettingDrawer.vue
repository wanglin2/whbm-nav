<template>
  <n-drawer v-model:show="drawerShow" :width="300">
    <n-drawer-content title="设置" closable class="settingDrawer">
      <div class="settingBox h-full relative">
        <div class="listBox absolute w-full bottom-0 top-0">
          <!-- 控制页面模块隐藏 -->
          <div class="block">
            <div class="title font-bold">控制页面内容模块显示</div>
            <div
              class="row flex items-center justify-between"
              v-for="item in propsList"
              :key="item.value"
            >
              <div class="text">{{ item.name }}</div>
              <div class="control">
                <n-switch v-model:value="controlShow[item.value]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent, NSwitch } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { reactive, watch } from "vue";
import { useStore } from "vuex";

// 控制页面模块隐藏
const useControlShow = ({ store }) => {
  const propsList = [
    {
      name: "是否显示图标导航区域",
      value: "showIconSiteArea",
    },
    {
      name: "是否显示搜索框",
      value: "showSearchInput",
    },
    {
      name: "是否显示底部区域",
      value: "showFooter",
    },
    {
      name: "是否显示右下角固定工具条",
      value: "showFixedTool",
    },
    {
      name: '是否开启沉浸式雨雪天气',
      value: 'showImmersiveWeather'
    },
    {
      name: '是否开启霜冻模式',
      value: 'showFrost'
    },
    {
      name: '是否开启广告栏',
      value: 'showAd'
    },
    {
      name: '是否固定显示快速定位',
      value: 'showQuickLocation'
    },
    {
      name: '是否开启烟花效果',
      value: 'showFireworks'
    }
  ];
  let propObj = {};
  propsList.forEach((item) => {
    propObj[item.value] = true;
  });
  const controlShow = reactive(propObj);
  if (store.state.userConfig) {
    propsList.forEach((item) => {
      controlShow[item.value] = store.state.userConfig[item.value];
    });
  }
  watch(
    () => {
      return controlShow;
    },
    () => {
      store.dispatch("updateUserConfig", {
        ...(store.state.userConfig || {}),
        ...controlShow,
      });
    },
    {
      deep: true,
    }
  );

  return {
    controlShow,
    propsList,
  };
};

const store = useStore();
const { drawerShow } = usrDrawer("settingDrawer");
const { controlShow, propsList } = useControlShow({ store });
</script>

<style lang="less" scoped>
.settingDrawer {
  /deep/ .n-drawer-body-content-wrapper {
    padding: 0;
  }
}

.settingBox {
  overflow: hidden;
  background-color: var(--site-library-background-color);

  .listBox {
    overflow: auto;
    padding: 20px;

    .block {
      background-color: var(--other-light-color);
      padding: 10px;
      margin-bottom: 30px;
      border-radius: 5px;

      .title {
        font-size: 16px;
        margin-bottom: 10px;
        color: var(--other-dark-color);
      }

      .row {
        margin-bottom: 10px;

        .text {
          font-size: 14px;
          color: var(--other-dark-color);
        }
      }
    }
  }
}
</style>
