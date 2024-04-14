<template>
  <div class="settingContainer">
    <div class="block">
      <div class="title">主题色</div>
      <div class="box">
        <div class="item flex items-center" v-for="color in colorsList" :key="color">
          <span class="name flex-shrink-0">{{cssVariables.nameMap[color]}}</span>
          <n-color-picker
            :value="colors[color]"
            :on-update:value="
              (value) => {
                colors[color] = value;
              }
            "
          />
          <span class="icon flex-shrink-0">
            <NIcon @click="colors[color] = ''">
              <Trash></Trash>
            </NIcon>
          </span>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="title">背景模糊度</div>
      <div class="box">
        <n-slider
          :value="blur"
          :step="1"
          :format-tooltip="(value) => `${value}%`"
          :on-update:value="onBlurUpdate"
        />
      </div>
    </div>
    <div class="block">
      <div class="title">内容块透明度</div>
      <div class="box">
        <n-slider
          :value="opacity"
          :step="0.1"
          :max="1"
          :on-update:value="onOpacityUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { NSlider, NColorPicker, NIcon } from "naive-ui";
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { Trash } from "@vicons/fa";
import cssVariables from '@/config/cssVariables';

// 主题色
const useThemeColor = ({ store }) => {
  const colors = ref({
    "--theme-color": "",
    "--my-color": "",
    "--light-color": "",
    "--site-block-hover-color": "",
    "--dark-color": "",
  });
  const colorsList = ref(Object.keys(colors.value).map((item) => {
    return item;
  }))
  const userConfigColors = computed(() => {
    return store.state.userConfig && store.state.userConfig.theme.colors
      ? store.state.userConfig.theme.colors
      : {};
  });
  const set = () => {
    Object.keys(userConfigColors.value).forEach((item) => {
      colors.value[item] = userConfigColors.value[item];
    });
  };
  set();
  watch(userConfigColors, set, {
    deep: true,
  });
  watch(
    colors,
    () => {
      store.dispatch("updateUserConfig", {
        theme: {
          ...(store.state.userConfig.theme || {}),
          colors: {
            ...colors.value
          },
        },
      });
    },
    {
      deep: true,
    }
  );

  return {
    colors,
    colorsList
  };
};

// 背景模糊度
const useBlur = ({ store }) => {
  const userConfigBlur = computed(() => {
    return store.state.userConfig ? store.state.userConfig.theme.blur : 0;
  });
  const blur = ref(userConfigBlur.value);
  watch(userConfigBlur, () => {
    blur.value = userConfigBlur.value;
  });
  const onBlurUpdate = (value) => {
    store.dispatch("updateUserConfig", {
      theme: {
        ...(store.state.userConfig.theme || {}),
        blur: value,
      },
    });
  };

  return {
    blur,
    onBlurUpdate,
  };
};

// 透明度
const useOpacity = ({ store }) => {
  const userConfigOpacity = computed(() => {
    return store.state.userConfig ? store.state.userConfig.theme.opacity : 0;
  });
  const opacity = ref(userConfigOpacity.value);
  watch(userConfigOpacity, () => {
    opacity.value = userConfigOpacity.value;
  });
  const onOpacityUpdate = (value) => {
    store.dispatch("updateUserConfig", {
      theme: {
        ...(store.state.userConfig.theme || {}),
        opacity: value,
      },
    });
  };

  return {
    opacity,
    onOpacityUpdate,
  };
};

const store = useStore();
const { colors, colorsList } = useThemeColor({ store });
const { blur, onBlurUpdate } = useBlur({ store });
const { opacity, onOpacityUpdate } = useOpacity({ store });
</script>

<style lang="less" scoped>
.settingContainer {
  .block {
    margin-bottom: 30px;

    .title {
      margin-bottom: 10px;
      color: var(--other-dark-color);
    }

    .box {
      .item {
        margin-bottom: 10px;

        .name {
          margin-right: 10px;
          color: var(--other-dark-color);
        }

        .icon {
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
