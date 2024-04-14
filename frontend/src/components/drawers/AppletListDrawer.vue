<template>
  <n-drawer v-model:show="drawerShow" :width="450" :z-index="500">
    <n-drawer-content title="小程序列表" closable class="appletListDrawer">
      <div class="appletListContainer">
        <div
          class="appletItem"
          v-for="item in list"
          :key="item.id"
          @click="openApplet(item)"
        >
          <div class="iconBox">
            <img :src="item.icon" alt="" />
          </div>
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="name">{{ item.name }}</div>
            </template>
            {{ item.descs }}
          </n-tooltip>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent, NTooltip, useMessage } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { watch, ref, getCurrentInstance, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
import { useStore } from "vuex";
import { useApplet } from "@/hooks/applet";

const { drawerShow } = usrDrawer("appletListDrawer");
const router = useRouter();
const { proxy } = getCurrentInstance();
const list = ref([]);
const store = useStore();
const userInfo = computed(() => {
  return store.state.userInfo;
});
const message = useMessage();

// 监听小程序最小化事件
const onAppletMinimize = () => {
  drawerShow.value = false;
};
useApplet({ proxy, onAppletMinimize });

const getAppletList = async () => {
  try {
    let { data } = await api.getAppletList();
    list.value = data.data || [];
  } catch (error) {
    console.log(error);
  }
};

watch(drawerShow, (val, oldVal) => {
  if (val && !oldVal) {
    getAppletList();
  }
});

// 打开小程序
const openApplet = (item) => {
  if (item.needLogin === "1" && !userInfo.value) {
    message.warning("请先登录");
    return;
  }
  if (item.type === "microApp") {
    proxy.$eventEmitter.emit("appletDrawer", true, item);
    let arr = item.activeRule.split("#");
    let path = arr[arr.length - 1];
    router.push(path);
  } else {
    proxy.$eventEmitter.emit("appletDrawer", true, item);
  }
};
</script>

<style lang="less" scoped>
.appletListContainer {
  display: flex;
  flex-wrap: wrap;

  .appletItem {
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-bottom: 30px;

    .iconBox {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .name {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}
</style>
