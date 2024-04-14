<template>
  <div class="navListContainer">
    <draggable
      v-model="navList"
      item-key="name"
      tag="transition-group"
      handle=".dragHandle"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      v-bind="dragOptions"
      @start="drag = true"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <div>
          <ClassNav
            style="margin-bottom: 12px"
            :data="element"
            :index="element.index"
          ></ClassNav>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { navClassMap } from "@/config/constants";
import ClassNav from "./ClassNav";
import { onUnmounted, ref, watch, getCurrentInstance, onUpdated } from "vue";
import { useStore } from "vuex";
import { useDrag } from "@/hooks/drag";
import { useUserClassTag } from '@/hooks/useUserClassTag';

// 初始化
const useInit = () => {
  const store = useStore();
  const { proxy } = getCurrentInstance();

  return {
    store,
    proxy,
  };
};

// 分类列表
const useNav = ({ store, classListMap, getUserClassTagList, proxy }) => {
  // 分类导航列表
  const navList = ref([]);
  const handleNavList = async () => {
    await getUserClassTagList();
    navList.value = store.state.userConfig.classNavList
      .map((name, index) => {
        let custom = !!(!navClassMap[name] && classListMap.value[name]);
        let data = custom ? classListMap.value[name] : navClassMap[name];
        if (!data) {
          return null;
        }
        return {
          custom,
          index,
          ...data,
        };
      })
      .filter((item) => {
        return !!item;
      });
  };
  watch(() => {
    return store.state.userConfig.classNavList;
  }, handleNavList);
  handleNavList();
  // 监听更新分类名称事件
  const updateUserClassName = ({ classId, className }) => {
    navList.value.forEach((item) => {
      if (String(item.id) === String(classId)) {
        item.name = className;
      }
    });
  };
  proxy.$eventEmitter.on("updateUserClassName", updateUserClassName);
  onUnmounted(() => {
    proxy.$eventEmitter.off("updateUserClassName", updateUserClassName);
  });

  // 拖拽结束
  const updateUserConfig = () => {
    store.dispatch("updateUserConfig", {
      classNavList: navList.value.map((item) => {
        return item.custom ? item.id : item.name;
      }),
    });
  };

  return {
    navList,
    updateUserConfig,
  };
};

const { store, proxy } = useInit();
const { classListMap, getUserClassTagList } = useUserClassTag();
const { navList, updateUserConfig } = useNav({
  store,
  classListMap,
  getUserClassTagList,
  proxy,
});
const { drag, dragOptions, onDragEnd } = useDrag({
  dragEndCallback: updateUserConfig,
});
onUpdated(() => {
  proxy.$eventEmitter.emit("navListUpdated");
})
</script>

<style lang="less">
@import url("../styles/drag.less");
</style>
<style lang="less" scoped>
.navListContainer {
  margin-top: 20px;
}
</style>
