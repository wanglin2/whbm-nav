<template>
  <div class="skinContainer">
    <div
      class="skinItem w-full relative"
      v-for="(item, index) in skinList"
      :key="index"
      :class="{ active: item.img === activeSkinUrl }"
      @click="changeSkin(item)"
    >
      <span class="order absolute text-center">{{ index + 1 }}</span>
      <img
        class="w-full h-full"
        :data-src="handleSkinUrl(item.img)"
        alt=""
        :ref="
          (el) => {
            if (el) imgRefList[index] = el;
          }
        "
      />
      <div
        class="
          checked
          absolute
          w-full
          h-full
          top-0
          left-0
          flex
          justify-center
          items-center
        "
        v-if="item.img === activeSkinUrl"
      >
        <span class="iconfont icon-xuanzhong"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  defineExpose,
} from "vue";
import { handleSkinUrl } from "@/utils";
import _ from "lodash";

// 主题列表
const useSkinList = ({ store }) => {
  const skinList = computed(() => {
    return store.state.config ? store.state.config.whbm.skin : [];
  });
  // 懒加载图片
  let scrollEl = null;
  const imgRefList = ref([]);
  const lazyLoadImage = () => {
    let elRect = scrollEl.getBoundingClientRect();
    imgRefList.value.forEach((el) => {
      if (el.getAttribute("loaded") === "true") {
        return;
      }
      let { top } = el.getBoundingClientRect();
      if (top >= 0 && top < elRect.bottom) {
        el.src = el.getAttribute("data-src");
        el.setAttribute("loaded", "true");
      }
    });
  };
  const lazyLoadImageFn = _.debounce(lazyLoadImage, 300);
  onMounted(() => {
    scrollEl = document.querySelector(
      ".skinDrawerContent .n-drawer-body-content-wrapper"
    );
    scrollEl.addEventListener("scroll", lazyLoadImageFn);
    lazyLoadImage();
  });
  onUnmounted(() => {
    scrollEl.removeEventListener("scroll", lazyLoadImageFn);
  });

  return {
    skinList,
    imgRefList,
  };
};

// 主题设置
const useSkinSetting = ({ store }) => {
  const userConfigSkin = computed(() => {
    return store.state.userConfig &&
      store.state.userConfig.theme.type === "skin"
      ? store.state.userConfig.theme.skin
      : null;
  });
  const activeSkinUrl = ref(
    userConfigSkin.value ? userConfigSkin.value.url : ""
  );
  const activeSkinColor = ref(
    userConfigSkin.value ? userConfigSkin.value.color : ""
  );
  watch(userConfigSkin, () => {
    if (userConfigSkin.value) {
      activeSkinUrl.value = userConfigSkin.value.url;
      activeSkinColor.value = userConfigSkin.value.color;
    } else {
      activeSkinUrl.value = "";
      activeSkinColor.value = "";
    }
  }, {
    deep: true
  });
  const changeSkin = (item) => {
    activeSkinUrl.value = item.img;
    activeSkinColor.value = item.col;
  };

  return {
    activeSkinUrl,
    activeSkinColor,
    changeSkin,
  };
};

const store = useStore();
const { skinList, imgRefList } = useSkinList({ store });
const { activeSkinUrl, activeSkinColor, changeSkin } = useSkinSetting({
  store,
});
defineExpose({
  activeSkinUrl,
  activeSkinColor,
});
</script>

<style lang="less" scoped>
.skinContainer {
  .skinItem {
    height: 150px;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 20px;

    .order {
      left: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
      background-color: var(--light-color);
      color: var(--other-dark-color);
      line-height: 30px;
      z-index: 3;
    }

    img {
      margin-bottom: 20px;
      transition: all 0.3s;
      transform-origin: center;
      object-fit: cover;
    }

    &:hover {
      img {
        transform: scale(1.05);
      }
    }

    .checked {
      background-color: var(--mask);
      z-index: 2;
      color: var(--light-color);

      .iconfont {
        font-size: 30px;
      }
    }
  }
}
</style>
