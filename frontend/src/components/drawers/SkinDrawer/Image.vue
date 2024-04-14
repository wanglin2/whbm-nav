<template>
  <div class="imageContainer">
    <div class="checkBox">
      <n-checkbox v-model:checked="randomImage">开启随机图片</n-checkbox>
    </div>
    <div class="imageBox" v-if="!randomImage">
      <div class="current relative w-full" v-if="currentUseImage">
        <img class="w-full h-full" :src="currentUseImage" alt="" />
        <div class="mask">当前使用</div>
      </div>
      <div class="imageList flex flex-wrap justify-between">
        <div
          class="imageItem relative"
          v-for="(item, index) in imageList"
          :key="index"
          @click="selectImage(item, index)"
        >
          <div class="mask checked" v-if="index === activeImageIndex">
            <span class="iconfont icon-xuanzhong"></span>
          </div>
          <img class="w-full h-full" :src="item" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NCheckbox } from "naive-ui";
import { useStore } from "vuex";
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  defineExpose,
} from "vue";
import api from "@/api";
import { handleAliyunUrl } from "@/utils";
import _ from "lodash";

// 图片设置
const useImageSetting = ({ store }) => {
  const userConfigImage = computed(() => {
    return store.state.userConfig &&
      store.state.userConfig.theme.type === "image"
      ? store.state.userConfig.theme.image
      : null;
  });
  const randomImage = ref(
    userConfigImage.value ? userConfigImage.value.random : false
  );
  const currentUseImage = ref(
    userConfigImage.value ? userConfigImage.value.url : ""
  );
  watch(userConfigImage, () => {
    if (userConfigImage.value) {
      randomImage.value = userConfigImage.value.random;
      currentUseImage.value = userConfigImage.value.url;
    } else {
      randomImage.value = false;
      currentUseImage.value = "";
    }
  }, {
    deep: true
  });

  return {
    randomImage,
    currentUseImage,
  };
};

// 图片列表
const useImageList = ({ store, randomImage }) => {
  const imageList = ref([]);
  let pageNo = 1;
  let pageSize = 20;
  let totalPage = 1;
  let finished = ref(false);
  let loding = ref(false);
  const activeImageIndex = ref(-1);
  const selectedImageUrl = ref("");

  // 请求图片列表数据
  const getImageList = async () => {
    try {
      if (finished.value || loding.value) {
        return;
      }
      loding.value = true;
      let { data } = await api.getImageList({
        pageNo,
        pageSize,
      });
      if (data && data.code === 0) {
        totalPage = data.data.totalPage;
        imageList.value.push(
          ...data.data.list.map((item) => {
            return handleAliyunUrl(item.name);
          })
        );
        if (pageNo >= totalPage) {
          finished.value = true;
        } else {
          pageNo++;
        }
      }
      loding.value = false;
    } catch (e) {
      console.log(e);
      loding.value = false;
    }
  };

  // 复位
  const reset = () => {
    imageList.value = [];
    pageNo = 1;
    totalPage = 1;
    finished.value = false;
    loding.value = false;
    activeImageIndex.value = -1;
    selectedImageUrl.value = "";
  };
  watch(randomImage, (val) => {
    if (val) {
      reset();
    } else {
      getImageList();
    }
  });
  if (!randomImage.value) {
    getImageList();
  }

  // 选择图片
  const selectImage = (item, index) => {
    activeImageIndex.value = index;
    selectedImageUrl.value = item;
  };

  // 懒加载图片
  let scrollEl = null;
  const checkLoadNextPage = () => {
    let { height } = scrollEl.getBoundingClientRect();
    let st = scrollEl.scrollTop;
    let sh = scrollEl.scrollHeight;
    if (st + height >= sh - 50) {
      getImageList();
    }
  };
  const checkLoadNextPageFn = _.debounce(checkLoadNextPage, 300);
  onMounted(() => {
    scrollEl = document.querySelector(
      ".skinDrawerContent .n-drawer-body-content-wrapper"
    );
    scrollEl.addEventListener("scroll", checkLoadNextPageFn);
  });
  onUnmounted(() => {
    scrollEl.removeEventListener("scroll", checkLoadNextPageFn);
  });

  return {
    imageList,
    activeImageIndex,
    selectImage,
		selectedImageUrl
  };
};

const store = useStore();
const { randomImage, currentUseImage } = useImageSetting({
  store,
});
const { imageList, activeImageIndex, selectImage, selectedImageUrl } = useImageList({
  store,
  randomImage,
});
defineExpose({
	randomImage,
  selectedImageUrl
});
</script>

<style lang="less" scoped>
.imageContainer {
  .checkBox {
    margin-bottom: 10px;
  }

  .imageBox {
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: var(--mask);
      z-index: 2;
      color: var(--light-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .current {
      height: 150px;
      margin-bottom: 20px;

      img {
        object-fit: cover;
      }
    }
    .imageList {

      .imageItem {
        width: 165px;
        height: 100px;
        overflow: hidden;
        margin-bottom: 10px;
        cursor: pointer;

        img {
          object-fit: cover;
        }

        .checked {
          .iconfont {
            font-size: 30px;
          }
        }
      }
    }
  }
}
</style>
