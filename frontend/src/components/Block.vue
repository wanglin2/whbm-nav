<template>
  <div class="moduleItemContainer relative w-full" ref="dom">
    <!-- 头部 -->
    <div class="header flex w-full relative" :class="{ oh: overflowHidden }">
      <div
        class="title flex items-center"
        :class="{ dragHandle: canDrag, center: !icon }"
        :style="{ background: titleBackground }"
      >
        <span class="iconBox flex items-center justify-center" v-if="icon" :data-icon="icon">
          <i class="icon iconfont" :class="[icon]"></i>
        </span>
        <span class="name">{{ title }}</span>
      </div>
      <div
        class="headerContent flex-grow h-full flex justify-between"
        :class="{ oh: overflowHidden }"
      >
        <slot name="header"></slot>
      </div>
    </div>
    <!-- 内容 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useOpacityBackground } from "@/hooks/background";

defineProps({
  // 图标
  icon: {
    type: String,
    default: "",
  },
  // 标题
  title: {
    type: String,
    default: "",
  },
  // 标题是否显示允许拖拽的鼠标效果
  canDrag: {
    type: Boolean,
    default: true,
  },
  // 标题部分的背景
  titleBackground: {
    type: String,
    default: "var(--theme-color)",
  },
  // 是否overflow:hidden
  overflowHidden: {
    type: Boolean,
    default: true,
  },
});
const { elContainer: dom } = useOpacityBackground();
</script>

<style lang="less" scoped>
.moduleItemContainer {
  border-radius: 5px;
  border: 1px solid var(--dark-color);

  .header {
    height: 40px;

    &.oh {
      overflow: hidden;
    }

    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 1px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--dark-color);
    }

    .title {
      width: 115px;
      flex-grow: 0;
      flex-shrink: 0;
      font-weight: bold;
      font-size: 16px;
      color: var(--light-color);
      border-top-left-radius: 5px;

      &.dragHandle {
        cursor: move;
      }

      &.center {
        justify-content: center;
      }

      .iconBox {
        width: 40px;
        height: 40px;
      }
    }

    .headerContent {
      &.oh {
        overflow: hidden;
      }
    }
  }
}
</style>
