<template>
  <n-drawer v-model:show="drawerShow" :width="300">
    <n-drawer-content title="管理分类导航的显示" closable>
      <div class="dragContainer">
        <div class="dragBox">
          <n-alert type="info" closable :show-icon="false">
            <p>1.勾选上的分类才会显示。</p>
            <p>2.可按住右侧按钮上下拖动进行排序。</p>
          </n-alert>
          <div class="btnGroup">
            <n-checkbox
              :checked="checkAll"
              :indeterminate="indeterminate"
              @click="onCheckAllClick"
              >{{ checkAll ? "取消全选" : "全选" }}</n-checkbox
            >
          </div>
          <draggable
            v-model="classList"
            item-key="name"
            tag="transition-group"
            handle=".btn"
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
              <div class="row flex w-full items-center">
                <div class="col flex items-center flex-shrink-0 checkbox">
                  <n-checkbox
                    v-model:checked="element.checked"
                    :label="element.name"
                  />
                </div>
                <div
                  class="col flex items-center flex-shrink-0 source"
                  :class="{ custom: element.custom }"
                >
                  {{ element.custom ? "用户" : "官方" }}
                </div>
                <div class="col flex items-center flex-shrink-0 btn">
                  <n-icon size="20">
                    <Sort />
                  </n-icon>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="btnBox absolute w-full left-0 bottom-0 flex items-center">
          <n-button type="primary" @click="updateUserConfig">确定</n-button>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import draggable from "vuedraggable";
import {
  NDrawer,
  NDrawerContent,
  NButton,
  NCheckbox,
  NIcon,
  NAlert,
  useMessage,
} from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { ref, getCurrentInstance, computed, watch } from "vue";
import { navClassList, navClassMap } from "@/config/constants";
import { useDrag } from "@/hooks/drag";
import { Sort } from "@vicons/fa";
import { useStore } from "vuex";
import { useUserClassTag } from "@/hooks/useUserClassTag";

// 初始化
const useInit = () => {
  const store = useStore();
  const { proxy } = getCurrentInstance();

  return {
    store,
    proxy,
  };
};

// 分类数据
const useClass = ({
  store,
  userClassList,
  classListMap,
  getUserClassTagList,
  drawerShow,
}) => {
  const message = useMessage();
  const useClassListConfig = computed(() => {
    return store.state.userConfig.classNavList;
  });
  const classList = ref([]);
  const has = (data, custom) => {
    return !!classList.value.find((item) => {
      return custom ? String(item.id) === String(data) : item.name === data;
    });
  };
  const init = async () => {
    classList.value = [];
    // 获取用户分类数据
    await getUserClassTagList();
    // 用户当前配置
    classList.value.push(
      ...useClassListConfig.value
        .map((name) => {
          let custom = !!(!navClassMap[name] && classListMap.value[name]);
          let data = custom ? classListMap.value[name] : navClassMap[name];
          if (!data) {
            return null;
          }
          return {
            custom,
            ...data,
            checked: true,
          };
        })
        .filter((item) => {
          return !!item;
        })
    );

    // 官方分类中未启用的数据
    classList.value.push(
      ...navClassList
        .filter((item) => {
          return !has(item.name);
        })
        .map((item) => {
          return {
            custom: false,
            ...item,
            checked: false,
          };
        })
    );

    // 用户分类中未启用的数据
    classList.value.push(
      ...userClassList.value
        .filter((item) => {
          return !has(item.id, true);
        })
        .map((item) => {
          return {
            custom: true,
            ...item,
            name: item.className,
            tag: item.className,
            checked: false,
          };
        })
    );
  };
  watch(useClassListConfig, init);
  init();

  // 更新用户配置
  const updateUserConfig = async () => {
    let classNavList = classList.value
      .filter((item) => {
        return item.checked;
      })
      .map((item) => {
        return item.custom ? item.id : item.name;
      });
    await store.dispatch("updateUserConfig", {
      classNavList,
    });
    drawerShow.value = false;
    message.success("修改成功");
  };

  return {
    classList,
    updateUserConfig,
  };
};

// 快捷操作
const useQuickHandle = ({ classList }) => {
  const checkAll = ref(false);
  const indeterminate = ref(false);
  watch(
    classList,
    () => {
      // 是否全部选中
      let isCheckAll = true;
      // 是否部分选中
      let isIndeterminate = false;
      classList.value.forEach((item) => {
        if (!item.checked) {
          isCheckAll = false;
        }
        if (item.checked) {
          isIndeterminate = true;
        }
      });
      checkAll.value = isCheckAll;
      indeterminate.value = !isCheckAll && isIndeterminate;
    },
    {
      deep: true,
    }
  );
  const onCheckAllClick = () => {
    if (checkAll.value) {
      classList.value.forEach((item) => {
        item.checked = false;
      });
    } else {
      classList.value.forEach((item) => {
        item.checked = true;
      });
    }
  };

  return {
    checkAll,
    indeterminate,
    onCheckAllClick,
  };
};

const { store } = useInit();
const { drawerShow } = usrDrawer("manageClassShowDrawer");
const { userClassList, classListMap, getUserClassTagList } = useUserClassTag();
const { classList, updateUserConfig } = useClass({
  store,
  userClassList,
  classListMap,
  getUserClassTagList,
  drawerShow,
});
const { drag, dragOptions, onDragEnd } = useDrag({});
const { checkAll, indeterminate, onCheckAllClick } = useQuickHandle({
  classList,
});
</script>

<style lang="less">
@import url("../../styles/drag.less");
</style>
<style lang="less" scoped>
/deep/.n-drawer-body {
  overflow: hidden;
}

.dragContainer {
  padding-bottom: 50px;

  .dragBox {
    .btnGroup {
      margin: 10px 0;
    }
  }

  .btnBox {
    height: 50px;
    background-color: var(--light-color);
    padding: 0 24px;
  }
}

.row {
  .col {
    height: 30px;

    &.btn {
      width: 50px;
      justify-content: center;
      cursor: move;
      color: var(--weak-dark-color);
    }

    &.source {
      width: 50px;
      justify-content: center;
      color: var(--theme-color);

      &.custom {
        color: var(--my-color);
      }
    }

    &.checkbox {
      flex-grow: 1;
    }
  }
}
</style>
