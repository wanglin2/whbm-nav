<template>
  <div class="searchInputContainer relative">
    <!-- 左边的云 -->
    <div class="cloudLeft absolute" @click.stop="toggleDropdown()">
      <span class="icon iconfont icon-yun"></span>
      <img
        v-if="currentEngine"
        :src="'./searchSitesIcons/' + currentEngine.icon"
        alt=""
        class="searchSiteIcon absolute"
      />
    </div>
    <!-- 搜索框 -->
    <div class="inputBox w-full h-full absolute">
      <input
        type="text"
        class="input absolute border-none px-4"
        :value="inputText"
        @input="onInput"
        @keyup="onInputKeyup"
      />
      <div
        class="btn h-full absolute flex items-center justify-end"
        @click="onSearchBtnClick"
      >
        <span class="icon iconfont icon-wxbsousuotuiguang"></span>
      </div>
      <!-- 云旁边的一撇 -->
      <div class="line absolute"></div>
    </div>
    <!-- 右边的云 -->
    <div
      class="cloudRight absolute"
      :class="{ hide: associationList.length || showSearchEngineDropdown }"
    >
      <span class="icon iconfont icon-yun"></span>
    </div>
    <!-- 搜索联想列表 -->
    <div
      class="associationList absolute animate__animated"
      v-if="associationList.length"
      :class="[associationList.length ? 'animate__fadeIn' : 'animate__fadeOut']"
    >
      <div
        class="associationItem"
        v-for="(item, index) in associationList"
        :key="index"
        @click="toSearch(item)"
      >
        {{ item }}
      </div>
      <span
        class="icon absolute iconfont icon-tuya_huabanfuben"
        :style="{ top: associationActiveIndex * 30 + 25 + 'px' }"
      ></span>
    </div>
    <!-- 搜索引擎列表 -->
    <div
      class="searchSitesList absolute animate__animated flex"
      v-if="showSearchEngineDropdown"
      :class="[
        showSearchEngineDropdown ? 'animate__fadeIn' : 'animate__fadeOut',
      ]"
      @click.stop
    >
      <div class="classList flex-shrink-0">
        <div
          class="classItem text-center"
          v-for="(item, index) in searchEngineList"
          :key="item.name"
          :class="{ active: activeEngineClassIndex === index }"
          @click="activeEngineClassIndex = index"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="siteList flex-grow flex flex-wrap items-start">
        <div
          class="siteItem flex flex-col items-center flex-grow-0"
          v-for="item in activeEngineList"
          :key="item.name"
          :class="{ active: defaultEngineName === item.name }"
          @click="changeDefaultEngineName(item)"
        >
          <img :src="'./searchSitesIcons/' + item.icon" alt="" />
          <span class="name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from "vue";
import api from "@/api";
import { useStore } from "vuex";
import { useDropDownMenu } from "@/hooks/dropdown";
import { useInput } from "@/hooks/input";

// 初始化
const useInit = () => {
  const store = useStore();

  return {
    store,
  };
};

// 搜索输入
const useSearchInput = () => {
  const { inputText, onInput } = useInput();

  return {
    inputText,
    onInput,
  };
};

// 联想词
const useAssociation = ({ inputText }) => {
  const associationList = ref([]);
  const associationActiveIndex = ref(-1);
  const associationIgnore = ref(false);

  // 复位
  const associationReset = () => {
    associationList.value = [];
    associationActiveIndex.value = -1;
  };

  // 监听搜索词变化
  watch(inputText, async () => {
    if (associationIgnore.value) {
      associationIgnore.value = false;
      return;
    }
    associationActiveIndex.value = -1;
    if (inputText.value) {
      let data = await api.searchAssociation(inputText.value);
      if (!inputText.value.trim()) {
        return;
      }
      associationList.value = data.s;
    } else {
      associationList.value = [];
    }
  });

  // 处理上、下键
  const onKeydown = (e) => {
    if (associationList.value.length <= 0) {
      return;
    }
    switch (e.keyCode) {
      case 38:
        e.preventDefault();
        if (associationActiveIndex.value > 0) {
          associationActiveIndex.value--;
        } else {
          associationActiveIndex.value = associationList.value.length - 1;
        }
        associationIgnore.value = true;
        inputText.value = associationList.value[associationActiveIndex.value];
        break;
      case 40:
        e.preventDefault();
        if (associationActiveIndex.value < associationList.value.length - 1) {
          associationActiveIndex.value++;
        } else {
          associationActiveIndex.value = 0;
        }
        associationIgnore.value = true;
        inputText.value = associationList.value[associationActiveIndex.value];
        break;
      default:
        break;
    }
  };
  window.addEventListener("keydown", onKeydown);

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
  });

  return {
    associationList,
    associationActiveIndex,
    associationReset,
    associationIgnore,
  };
};

// 搜索
const useSearch = ({
  inputText,
  associationList,
  associationActiveIndex,
  currentEngine,
  associationReset,
  associationIgnore,
}) => {
  // 搜索
  const toSearch = (text) => {
    associationIgnore.value = true;
    inputText.value = text;
    associationReset();
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = `${currentEngine.value.url}?${currentEngine.value.query}=${text}`;
    a.click();
  };

  // 处理搜索词
  const handleSearch = () => {
    if (!inputText.value.trim()) {
      return;
    }
    let text = "";
    if (associationActiveIndex.value >= 0) {
      text = associationList.value[associationActiveIndex.value];
    } else {
      text = inputText.value.trim();
    }
    toSearch(text);
  };

  // 回车搜索
  const onInputKeyup = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  // 点击搜索按钮
  const onSearchBtnClick = () => {
    handleSearch();
  };

  return {
    onInputKeyup,
    toSearch,
    onSearchBtnClick,
  };
};

// 默认搜索引擎
const useSearchEngine = ({ store }) => {
  // 引擎列表
  const searchEngineList = computed(() => {
    return store.state.config ? store.state.config.whbm.searchSiteList : [];
  });
  // 通过名称获取引擎数据
  const getEngineByName = (name) => {
    let engineData = null;
    searchEngineList.value.forEach((item) => {
      if (engineData) {
        return;
      }
      item.list.forEach((engine) => {
        if (engine.name === name) {
          engineData = { ...engine };
        }
      });
    });
    return engineData;
  };
  // 当前默认的引擎名称
  const defaultEngineName = computed(() => {
    return store.state.userConfig
      ? store.state.userConfig.searchEngine
      : "百度";
  });
  // 当前引擎数据
  const currentEngine = computed(() => {
    return getEngineByName(defaultEngineName.value);
  });
  // 修改默认引擎
  const changeDefaultEngineName = (item) => {
    store.dispatch("updateUserConfig", {
      searchEngine: item.name,
    });
  };

  return {
    searchEngineList,
    currentEngine,
    defaultEngineName,
    changeDefaultEngineName,
  };
};

// 搜索引擎设置
const useSearchEngineList = ({ searchEngineList }) => {
  const { showDropdown, toggleDropdown, distory } = useDropDownMenu();
  const showSearchEngineDropdown = computed(() => {
    return showDropdown.value;
  });
  const activeEngineClassIndex = ref(0);
  const activeEngineList = computed(() => {
    return searchEngineList.value[activeEngineClassIndex.value].list;
  });

  onUnmounted(() => {
    distory();
  });

  return {
    showSearchEngineDropdown,
    toggleDropdown,
    activeEngineList,
    activeEngineClassIndex,
  };
};

const { store } = useInit();
const { inputText, onInput } = useSearchInput();
const {
  associationList,
  associationActiveIndex,
  associationReset,
  associationIgnore,
} = useAssociation({ inputText });
const {
  searchEngineList,
  currentEngine,
  defaultEngineName,
  changeDefaultEngineName,
} = useSearchEngine({
  store,
});
const { onInputKeyup, toSearch, onSearchBtnClick } = useSearch({
  inputText,
  associationList,
  associationActiveIndex,
  currentEngine,
  associationReset,
  associationIgnore,
});
const {
  showSearchEngineDropdown,
  toggleDropdown,
  activeEngineList,
  activeEngineClassIndex,
} = useSearchEngineList({ searchEngineList });
</script>

<style lang="less" scoped>
.searchInputContainer {
  width: 350px;
  height: 50px;
  border-radius: 25px;
  background-color: var(--light-color);

  .cloudLeft,
  .cloudRight {
    .icon {
      font-size: 50px;
      color: var(--dark-color);
    }
  }

  .cloudLeft {
    left: -11px;
    top: -39px;
    transform: rotateZ(-23deg);
    cursor: pointer;

    .searchSiteIcon {
      left: 18px;
      top: 24px;
      width: 15px;
      height: 15px;
      object-fit: cover;
    }
  }

  .cloudRight {
    right: -11px;
    bottom: -39px;
    transform: rotateZ(157deg);
    z-index: -1;
    // background-color: var(--light-color);
    transition: all 0.5s;
    opacity: 1;

    &.hide {
      opacity: 0;
    }
  }

  .inputBox {
    left: 0px;
    top: 0px;
    z-index: 2;
    border: 2px solid var(--dark-color);
    border-radius: 25px;

    .input {
      outline: none;
      border: 2px solid var(--dark-color);
      border-radius: 25px;
      border-right-style: solid;
      left: -2px;
      top: -2px;
      width: 300px;
      height: 50px;
      z-index: 4;
    }

    .btn {
      width: 80px;
      background-color: var(--theme-color);
      right: 0;
      top: 0;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      z-index: 3;
      padding-right: 10px;
      color: var(--light-color);
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }

      .icon {
        font-size: 30px;
      }
    }

    .line {
      width: 36px;
      height: 36px;
      left: 5px;
      top: 5px;
      border: 2px solid transparent;
      border-left-color: var(--dark-color);
      border-radius: 18px;
      z-index: 3;
      transform: rotateZ(58deg);
      pointer-events: none;
    }
  }

  .associationList {
    padding-top: 25px;
    width: 350px;
    border: 2px solid var(--dark-color);
    top: 25px;
    left: 0px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    background-color: var(--light-color);
    z-index: 1;

    .associationItem {
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;
      padding: 0 10px;
      border-bottom: 2px solid var(--dark-color);
      color: var(--other-dark-color);

      &:last-of-type {
        border-bottom: none;
      }
    }

    .icon {
      right: 10px;
      transition: all 0.3s;
      color: var(--other-dark-color);
    }
  }

  .searchSitesList {
    padding-top: 23px;
    width: 350px;
    border: 2px solid var(--dark-color);
    top: 25px;
    left: 0px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    background-color: var(--light-color);
    z-index: 1;

    .classList {
      width: 50px;
      border-right: 2px solid var(--other-dark-color);

      .classItem {
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        cursor: pointer;
        color: var(--other-dark-color);

        &.active {
          color: var(--theme-color);
        }
      }
    }

    .siteList {
      height: fit-content;
      padding: 10px 5px;

      .siteItem {
        width: 25%;
        height: 50px;
        overflow: hidden;
        cursor: pointer;
        margin-bottom: 10px;

        &.active {
          .name {
            color: var(--theme-color);
          }
        }

        img {
          height: 20px;
          margin-bottom: 5px;
        }

        .name {
          font-size: 14px;
          color: var(--other-dark-color);
        }
      }
    }
  }
}
</style>
