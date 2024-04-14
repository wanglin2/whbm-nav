<template>
  <div class="siteListBlockContainer">
    <Block v-bind="$attrs">
      <!-- 标题栏 -->
      <template v-slot:header>
        <slot name="header">
          <div class="closeBtnBox w-full h-full flex items-center justify-end" v-if="showCloseBtn">
            <span
              class="closeBtn iconfont icon-guanbi"
              @click="onCloseBtnClick"
            ></span>
          </div>
        </slot>
      </template>
      <!-- loding -->
      <div
        class="loadingBox w-full flex justify-center items-center"
        v-if="isLoading"
      >
        <n-spin size="small" :stroke="themeColor" />
      </div>
      <!-- 失败提示 -->
      <div class="tipBox errorBox text-center" v-if="isError">
        <span class="tip" @click="onErrorClick">{{ errorTip }}</span>
      </div>
      <!-- 没有数据的提示 -->
      <div
        class="tipBox noDataBox text-center"
        v-if="!isError && !isLoading && list.length <= 0"
      >
        <span class="tip">{{ noDataTip }}</span>
      </div>
      <!-- 内容 -->
      <div
        v-if="list.length > 0"
        class="content"
        :style="{ height: (showAll ? totalHeight : initHeight) + 20 + 'px' }"
      >
        <div class="item" v-for="(item, index) in list" :key="index">
          <n-tooltip trigger="hover" placement="top" :disabled="checkTooltipDiabled(item)">
            <template #trigger>
              <a :href="item.siteurl || item.siteUrl" target="_blank">
                <img v-if="item.siteIcon" :src="item.siteIcon" alt="" />
                <span
                  class="name"
                  :style="{ width: item.siteIcon ? '115px' : '130px' }"
                  >{{ item.sitename || item.siteName }}</span
                >
              </a>
            </template>
            {{ item.descs || item.siteDesc || item.sitedesc }}
          </n-tooltip>
        </div>
      </div>
      <!-- 展开收缩按钮 -->
      <n-tooltip
        trigger="hover"
        placement="top"
        v-if="initHeight < totalHeight"
      >
        <template #trigger>
          <div
            class="expandBtn absolute flex justify-center items-center"
            @click="toggleShow"
          >
            <span
              class="icon iconfont icon-zhankai"
              :class="{ show: showAll }"
            ></span>
          </div>
        </template>
        {{ showAll ? "收起" : "显示所有网站" }}
      </n-tooltip>
    </Block>
  </div>
</template>

<script setup>
import Block from "./Block";
import { NTooltip, NSpin } from "naive-ui";
import { useStore } from "vuex";
import cssVariables from "@/config/cssVariables";
import { ref, defineProps, computed, defineEmits } from "vue";

const props = defineProps({
  // 网站数据
  list: {
    type: Array,
    default() {
      return [];
    },
  },
  // 是否显示loading
  isLoading: {
    type: Boolean,
    default: false,
  },
  // 是否显示错误
  isError: {
    type: Boolean,
    default: false,
  },
  errorTip: {
    type: String,
    default: "加载失败，点击重试",
  },
  // 没有数据的提示
  noDataTip: {
    type: String,
    default: "这里空空如也~",
  },
  // 是否显示关闭按钮
  showCloseBtn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "errorClick"]);

// 初始化
const useInit = () => {
  const store = useStore();
  const userConfig = computed(() => {
    return store.state.userConfig;
  });
  const themeColor = computed(() => {
    return cssVariables.getCssVariables(userConfig.value.mode)["--theme-color"];
  });

  return {
    store,
    userConfig,
    themeColor,
  };
};

// 事件
const useEvents = () => {
  // 关闭按钮点击事件
  const onCloseBtnClick = () => {
    emit("close");
  };

  // 错误提示点击事件
  const onErrorClick = () => {
    emit("errorClick");
  };

  return {
    onCloseBtnClick,
    onErrorClick,
  };
};

// 展开收起
const useExpand = ({ props }) => {
  // 每行形式的网站块数量
  const rowCount = ref(9);
  // 一个网站块的高度
  const siteBlockHeight = ref(40);
  // 初始化显示多少行
  const initShowRows = ref(4);
  // 总高度
  const totalHeight = computed(() => {
    return (
      Math.ceil(props.list.length / rowCount.value) * siteBlockHeight.value
    );
  });
  // 初始高度
  const initHeight = computed(() => {
    return Math.min(
      totalHeight.value,
      initShowRows.value * siteBlockHeight.value
    );
  });
  // 切换展开
  const showAll = ref(false);
  const toggleShow = () => {
    showAll.value = !showAll.value;
  };

  return {
    showAll,
    initHeight,
    totalHeight,
    toggleShow,
  };
};

// tooltip
const useTooltip = () => {
  const checkTooltipDiabled = (item) => {
    let desc = item.descs || item.siteDesc || item.sitedesc
    return !desc || desc === 'null' ;
  }
  return {
    checkTooltipDiabled
  };
}

const { themeColor } = useInit();
const { onCloseBtnClick, onErrorClick } = useEvents();
const { showAll, initHeight, totalHeight, toggleShow } = useExpand({
  props,
});
const { checkTooltipDiabled } = useTooltip()
</script>

<style lang="less" scoped>
.siteListBlockContainer {
  .closeBtnBox {
    padding-right: 10px;

    .closeBtn {
      font-size: 20px;
      cursor: pointer;
    }
  }

  .loadingBox {
    height: 100px;
  }

  .tipBox {
    height: 100px;
    line-height: 100px;
    color: var(--dark-color);

    &.errorBox {
      color: var(--error-color);
    }

    .tip {
      cursor: pointer;
    }
  }

  .content {
    padding: 10px;
    overflow: hidden;
    transition: height 0.3s;
    display: flex;
    flex-wrap: wrap;
    .item {
      display: inline-block;
      font-size: 14px;
      width: 111px;
      height: 40px;
      padding: 0 5px;
      transition: all 0.5s ease;
      overflow: hidden;

      &:hover {
        background-color: var(--site-block-hover-color);
      }

      a {
        display: flex;
        width: 100%;
        height: 100%;
        text-decoration: none;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 15px;
          height: 15px;
          object-fit: contain;
          margin-right: 5px;
        }

        .name {
          font-family: 黑体;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dark-color);
        }
      }
    }
  }

  .expandBtn {
    right: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 5px;

    &:hover {
      background-color: var(--site-block-hover-color);
    }

    .icon {
      transform: rotateY(0);
      transition: all 0.3s;

      &.show {
        transform: rotateX(180deg);
      }
    }
  }
}
</style>
