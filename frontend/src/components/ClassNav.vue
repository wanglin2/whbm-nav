<template>
  <SiteListBlock
    :icon="data.icon"
    :title="data.name"
    errorTip="加载失败，点击重试"
    :isLoading="isLoading"
    :isError="isError"
    :list="activeList"
    @errorClick="getSiteList"
    ref="dom"
  >
    <template v-slot:header>
      <ScrollList v-if="groupList.length > 0">
        <div class="classlist">
          <div
            class="item relative"
            v-for="(item, index) in groupList"
            :key="index"
            :class="{ active: activeIndex === index }"
            @click="tabChange(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </ScrollList>
    </template>
  </SiteListBlock>
</template>

<script setup>
import ScrollList from "./ScrollList";
import api from "@/api";
import _ from "lodash";
import {
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  getCurrentInstance,
  nextTick,
  computed,
} from "vue";
import SiteListBlock from "@c/SiteListBlock";

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  index: {
    type: Number,
    default: 0,
  },
});

let unbindEvent = null;

// 初始化
const useInit = () => {
  const { proxy } = getCurrentInstance();
  return {
    proxy,
  };
};

// 获取网站数据
const useSite = ({ props, proxy }) => {
  const loaded = ref(false);
  const isError = ref(false);
  const isLoading = ref(false);
  const activeList = ref([]);
  const groupList = ref([]);
  const activeIndex = ref(0);
  const dom = ref(null);
  const custom = computed(() => {
    return props.data.custom;
  });

  // 获取分类数据
  const getSiteList = async () => {
    try {
      isError.value = false;
      isLoading.value = true;
      let data = [];
      // 用户分类数据
      if (custom.value) {
        let res = await api.getUserClassSiteListById({
          id: props.data.id,
        });
        data = res.data;
      } else {
        // 官方分类数据
        let res = await api.getSiteList({
          channel: props.data.name,
        });
        data = res.data;
      }
      // 最新添加和常用网站特别处理
      if (["Latest", "Common"].includes(props.data.tag)) {
        activeList.value = data.data;
      } else if (data.data.length > 0) {
        let group = _.groupBy(data.data, (e) => {
          return e[custom.value ? "tagName" : "types"];
        });
        let list = [];
        Object.keys(group).forEach((item) => {
          list.push({
            name: (item === "null" ? props.data.name : item) || "未命名",
            list: group[item],
          });
        });
        groupList.value = list.concat([
          // {
          //   name: "测试1",
          //   list: [],
          // },
          // {
          //   name: "测试2",
          //   list: [],
          // },
          // {
          //   name: "测试3",
          //   list: [],
          // },
          // {
          //   name: "测试4",
          //   list: [],
          // },
          // {
          //   name: "测试5",
          //   list: [],
          // },
        ]);
        activeList.value = groupList.value[0].list;
      } else {
        groupList.value = []
        activeList.value = []
        activeIndex.value = 0
      }
      loaded.value = true;
      isLoading.value = false;
      nextTick(() => {
        proxy.$eventEmitter.emit("classSiteLoaded", props.data.name);
      });
      unbindEvent();
      proxy.$eventEmitter.off("classSiteLoaded", onOtherClassBlockChange);
      proxy.$eventEmitter.off("classSiteTabChange", onOtherClassBlockChange);
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      isError.value = true;
    }
  };

  // 检查是否请求数据
  const check = () => {
    if (isLoading.value) {
      return;
    }
    if (loaded.value) {
      return;
    }
    if (!dom.value) {
      return;
    }
    let { top, bottom } = dom.value.$el.getBoundingClientRect();
    let windowHeight = window.innerHeight;
    if (bottom >= 40 && top <= windowHeight - 50) {
      getSiteList();
    }
  };

  // 其他导航块的加载事件
  const onOtherClassBlockChange = (name) => {
    if (name !== props.data.name) {
      check();
    }
  };
  proxy.$eventEmitter.on("classSiteLoaded", onOtherClassBlockChange);
  proxy.$eventEmitter.on("classSiteTabChange", onOtherClassBlockChange);

  // 切换tab
  const tabChange = (index) => {
    activeIndex.value = index;
    activeList.value = groupList.value[activeIndex.value].list;
    nextTick(() => {
      proxy.$eventEmitter.emit("classSiteTabChange", props.data.name);
    });
  };

  // 用户添加、编辑、删除分类网站数据
  const refreshData = ({ classId }) => {
    if (!loaded.value) {
      return;
    }
    if (Array.isArray(classId)) {
      let valid = false;
      classId.forEach((id) => {
        if (String(props.data.id) === String(id)) {
          valid = true;
        }
      });
      if (!valid) {
        return;
      }
    } else if (String(props.data.id) !== String(classId)) {
      return;
    }
    getSiteList();
  };
  if (custom.value) {
    proxy.$eventEmitter.on("refreshUserClassSite", refreshData);
  }

  onUnmounted(() => {
    if (custom.value) {
      proxy.$eventEmitter.off("refreshUserClassSite", refreshData);
    }
  });

  return {
    isLoading,
    isError,
    activeList,
    getSiteList,
    groupList,
    activeIndex,
    tabChange,
    check,
    dom,
  };
};

// 滚动事件
const useScroll = ({ check }) => {
  let timer = null;

  // 滚动事件
  const onscroll = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      check();
    }, 300);
  };

  // 解绑事件
  unbindEvent = () => {
    window.removeEventListener("scroll", onscroll);
  };

  onUnmounted(() => {
    unbindEvent();
  });

  onMounted(() => {
    // 监听滚动事件
    setTimeout(() => {
      check();
      window.addEventListener("scroll", onscroll);
    }, 500);
  });
};

const { proxy } = useInit();
const {
  isLoading,
  isError,
  activeList,
  getSiteList,
  groupList,
  activeIndex,
  tabChange,
  check,
  dom,
} = useSite({ props, proxy });
useScroll({ check, props });
</script>

<style lang="less" scoped>
.classlist {
  height: 40px;
  width: max-content;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  user-select: none;

  .item {
    flex-grow: 0;
    flex-shrink: 0;
    line-height: 40px;
    padding: 0 14px;
    font-size: 14px;
    font-family: 黑体;
    color: var(--dark-color);
    font-weight: bold;

    &.active {
      color: var(--theme-color);

      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 4px;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--theme-color);
        z-index: 2;
      }
    }
  }
}
</style>
