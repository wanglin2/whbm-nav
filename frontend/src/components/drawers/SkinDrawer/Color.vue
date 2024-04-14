<template>
  <div class="colorContainer">
    <div class="title">自定义颜色</div>
    <div class="colorPick">
      <n-color-picker :value="customColor" :on-update:value="onColorChange" />
    </div>
    <div class="title">推荐颜色</div>
    <div class="colorList flex flex-wrap justify-between">
      <div
        class="colorItem relative"
        v-for="item in colorList"
        :key="item"
        :style="{ backgroundColor: item }"
        @click="setColor(item)"
      >
        <div
          class="checked absolute left-0 top-0 flex justify-center items-center"
          v-if="item === preinstallColor"
        >
          <span class="iconfont icon-xuanzhong"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { colorList } from "@/config/constants";
import { NColorPicker } from "naive-ui";
import { useStore } from "vuex";
import { computed, ref, watch, defineExpose } from "vue";

// 初始化
const useInit = ({ store }) => {
  const userConfigColor = computed(() => {
    return store.state.userConfig &&
      store.state.userConfig.theme.type === "color"
      ? store.state.userConfig.theme.color
      : null;
  });
  // 自定义颜色
  const customColor = ref("");
  // 预设颜色
  const preinstallColor = ref("");
  return {
    userConfigColor,
    customColor,
    preinstallColor,
  };
};

// 自定义颜色
const useCustomColor = ({ customColor, preinstallColor, userConfigColor }) => {
  // 初始颜色
  const setInitColor = () => {
    if (userConfigColor.value && userConfigColor.value.custom) {
      customColor.value = userConfigColor.value.color;
    } else {
      customColor.value = "";
    }
  };
  watch(
    userConfigColor,
    () => {
      setInitColor();
    },
    {
      deep: true,
    }
  );
  setInitColor();

  // 选择颜色
  const onColorChange = (value) => {
    customColor.value = value;
    preinstallColor.value = "";
  };

  return {
    onColorChange,
  };
};

// 预设颜色
const usePreinstallColor = ({
  preinstallColor,
  customColor,
  userConfigColor,
}) => {
  // 初始颜色
  const setInitColor = () => {
    if (userConfigColor.value && !userConfigColor.value.custom) {
      preinstallColor.value = userConfigColor.value.color;
    } else {
      preinstallColor.value = "";
    }
  };
  watch(
    userConfigColor,
    () => {
      setInitColor();
    },
    {
      deep: true,
    }
  );
  setInitColor();

  // 选择颜色
  const setColor = (item) => {
    preinstallColor.value = item;
    customColor.value = "";
  };

  return {
    setColor,
  };
};

const store = useStore();
const { userConfigColor, customColor, preinstallColor } = useInit({ store });
const { onColorChange } = useCustomColor({
  customColor,
  preinstallColor,
  userConfigColor,
});
const { setColor } = usePreinstallColor({
  preinstallColor,
  customColor,
  userConfigColor,
});
defineExpose({
  customColor,
  preinstallColor,
});
</script>

<style lang="less" scoped>
.colorContainer {
  .title {
    color: var(--other-dark-color);
    margin-bottom: 10px;
  }

  .colorList {
    .colorItem {
      width: 165px;
      height: 100px;
      margin-bottom: 15px;
      cursor: pointer;

      .checked {
        background-color: var(--light-color);
        width: 30px;
        height: 30px;
        color: var(--other-dark-color);
      }
    }
  }
}
</style>
