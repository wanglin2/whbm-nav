<template>
  <div class="item relative">
    <div class="row flex" v-for="(item, index) in list" :key="index">
      <span class="name inline-block flex-shrink-0">{{ item.name }}</span>
      <a
        v-if="item.isLink"
        class="value flex-grow"
        :class="{ noWrap: noWrap }"
        :href="item.value"
        target="_blank"
        >{{ item.value }}</a
      >
      <span v-else class="value" :class="{ noWrap: noWrap }">
        {{ item.value }}
      </span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  list: {
    type: Array,
    default() {
      return [];
    },
  },
  noWrap: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
.item {
  border: 1px solid var(--other-dark-color);
  border-radius: 5px;
  padding: 10px;
  overflow: hidden;
  margin-bottom: 12px;

  .row {
    overflow: hidden;

    .name {
      width: 55px;
      color: var(--weak-dark-color);
    }

    .value {
      color: var(--other-dark-color);

      &.noWrap {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .tag {
    width: 80px;
    height: 30px;
    border: 2px solid var(--theme-color);
    line-height: 30px;
    font-size: 16px;
    color: var(--theme-color);
    transform: rotate(45deg);
    top: 30px;
    right: 20px;
  }
}
</style>
