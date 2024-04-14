<template>
  <div class="myContainer">
    <SearchResult></SearchResult>
    <Block
      icon="icon-jia"
      title="我的空间"
      :canDrag="false"
      :titleBackground="myColor"
      :overflowHidden="false"
    >
      <template v-slot:header>
        <div class="left h-full flex items-center">
          <!-- 工具按钮 -->
          <template v-for="item in btnList" :key="item.name">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <div
                  class="iconBtn text-center"
                  :class="[item.class]"
                  @click="onBtnClick(item)"
                >
                  <span
                    class="icon iconfont"
                    :class="[item.icon]"
                    :style="item.style || {}"
                  ></span>
                  <span class="markIcon"></span>
                </div>
              </template>
              {{ item.name }}
            </n-tooltip>
          </template>
        </div>
        <div class="right h-full">
          <!-- 搜索框 -->
          <div class="searchInputBox h-full relative">
            <div class="input h-full">
              <input
                type="text"
                class="h-full bg-transparent"
                placeholder="搜索站内网站"
                :value="inputText"
                @input="onInput"
                @keyup="onEnter"
              />
            </div>
            <div
              class="suggestList absolute w-full animate__animated"
              :class="[
                showDropdown ? 'animate__fadeIn' : 'animate__fadeOut',
                { show: showDropdown },
              ]"
            >
              <div
                class="suggestItem"
                v-for="(item, index) in suggestList"
                :key="index"
              >
                <a class="block" :href="item.siteurl" target="_blank">{{
                  item.sitename
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 内容 -->
      <div class="content">
        <!-- 我的网站 -->
        <div class="mySiteList w-full">
          <div class="siteList w-full" v-if="mySiteList.length > 0">
            <div class="item" v-for="(item, index) in mySiteList" :key="index">
              <n-tooltip
                trigger="hover"
                placement="top"
                :disabled="!item.sitedesc"
              >
                <template #trigger>
                  <a :href="item.siteurl" target="_blank">
                    <img v-if="item.siteicon" :src="item.siteicon" alt="" />
                    <span class="name">{{ item.sitename }}</span>
                  </a>
                </template>
                {{ item.sitedesc }}
              </n-tooltip>
            </div>
          </div>
          <div class="noData text-center" v-else>
            {{
              userInfo
                ? "这里空空如也~去收藏你的第一个网站吧"
                : "登录后开启收藏~"
            }}
          </div>
          <div class="pagination w-full" v-if="mySitePageCount > 1">
            <n-pagination
              v-model:page="mySitePageNo"
              :page-count="mySitePageCount"
              :on-update:page="mySitePageChange"
            />
          </div>
        </div>
      </div>
    </Block>
    <Loading
      v-model:active="isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="themeColor"
      loader="dots"
    />
  </div>
</template>

<script setup>
import { NTooltip, NPagination, useMessage, useDialog } from "naive-ui";
import { ref, watch, getCurrentInstance, onUnmounted, computed } from "vue";
import { useDropDownMenu } from "@/hooks/dropdown";
import { useInput } from "@/hooks/input";
import api from "@/api";
import Block from "./Block";
import SearchResult from "./SearchResult";
import { useStore } from "vuex";
import cssVariables from "@/config/cssVariables";
import { openUrl } from "@/utils";
import { useBookmark } from "@/hooks/bookmark";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { myToolList } from "@/config/constants";
import { useRouter, useRoute } from "vue-router";
import { useApplet } from "@/hooks/applet";

// 初始化
const useInit = () => {
  const store = useStore();
  const router = useRouter();
  const { proxy } = getCurrentInstance();
  const userInfo = computed(() => {
    return store.state.userInfo;
  });
  const userConfig = computed(() => {
    return store.state.userConfig;
  });
  const myColor = computed(() => {
    return userConfig.value
      ? cssVariables.getCssVariables(userConfig.value.mode)["--my-color"]
      : "#ffbf65";
  });
  const themeColor = computed(() => {
    return userConfig.value
      ? cssVariables.getCssVariables(userConfig.value.mode)["--theme-color"]
      : "#87BDFF";
  });

  return {
    store,
    router,
    proxy,
    myColor,
    themeColor,
    userInfo,
  };
};

// 工具按钮
const useBtn = ({ proxy, userInfo, router, isAppletMinimize }) => {
  const message = useMessage();
  const dialog = useDialog();
  const { importBookmark, exportBookmark, isLoading } = useBookmark();
  const btnList = ref(myToolList);

  const onBtnClick = (item) => {
    // 小程序
    if (item.isApplet) {
      proxy.$eventEmitter.emit("appletDrawer", true);
      router.push(item.url);
      return;
    }
    // 普通url
    if (item.url) {
      openUrl(item.url);
      return;
    }
    // 需要登录的功能
    if (item.needLogin && !userInfo.value) {
      return message.warning("登录后即可使用该功能");
    }
    // 其他自定义功能
    switch (item.id) {
      case "mySite":
        proxy.$eventEmitter.emit("editMySiteDrawer", true);
        break;
      case "addSite":
        proxy.$eventEmitter.emit("addMySiteDrawer", true);
        break;
      case "manageClassShow":
        proxy.$eventEmitter.emit("manageClassShowDrawer", true);
        break;
      case "skin":
        proxy.$eventEmitter.emit("skinDrawer", true);
        break;
      case "importBookmark":
        importBookmark((err) => {
          if (err) {
            message.error("导入失败");
          } else {
            message.success("导入成功");
            proxy.$eventEmitter.emit("refreshMySite");
          }
        });
        break;
      case "exportBookmark":
        dialog.warning({
          title: "提示",
          content: "导出文件可用于导入到其他浏览器，是否确认导出我的网站？",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            exportBookmark((err) => {
              if (err) {
                message.error("导出失败");
              } else {
                message.success("导出成功");
              }
            });
          },
          onNegativeClick: () => {},
        });
        break;
      case "comment":
        proxy.$eventEmitter.emit("commentDrawer", true);
        break;
      case "recommend":
        proxy.$eventEmitter.emit("recommendDrawer", true);
        break;
      case "notice":
        proxy.$eventEmitter.emit("noticeDrawer", true);
        break;
      case "siteLibrary":
        proxy.$eventEmitter.emit("siteLibraryDrawer", true);
        break;
      case "setting":
        proxy.$eventEmitter.emit("settingDrawer", true);
        break;
      case "appletList":
        if (isAppletMinimize.value) {
          proxy.$eventEmitter.emit("resumeMinimizeApplet");
        } else {
          proxy.$eventEmitter.emit("appletListDrawer", true);
        }
        break;
      default:
        break;
    }
  };
  return {
    btnList,
    onBtnClick,
    isLoading,
  };
};

// 搜索
const useSearch = ({ store }) => {
  const { showDropdown } = useDropDownMenu();
  const notShowSuggest = ref(false);

  // 请求数据
  const getData = async (count = -1) => {
    try {
      if (!inputText.value.trim()) {
        return;
      }
      let { data } = await api.searchSites({
        keyword: inputText.value,
        count,
      });
      if (data && data.code === 0) {
        return data.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 搜索
  const search = async () => {
    resetSuggest();
    notShowSuggest.value = true;
    let data = await getData();
    store.commit("setSearchResultList", data || []);
  };
  const { inputText, onInput, onEnter } = useInput(search);

  // 快速搜索
  const suggestList = ref([]);
  const resetSuggest = () => {
    suggestList.value = [];
    showDropdown.value = false;
  };
  const getSuggest = async () => {
    resetSuggest();
    let data = await getData(10);
    if (notShowSuggest.value) {
      notShowSuggest.value = false;
      return;
    }
    if (!inputText.value.trim()) {
      return;
    }
    if (data.length <= 0) {
      return;
    }
    suggestList.value = data;
    showDropdown.value = true;
  };
  let timer = null;
  watch(inputText, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      getSuggest();
    }, 300);
  });

  return {
    inputText,
    onInput,
    onEnter,
    showDropdown,
    suggestList,
  };
};

// 我的网站
const useMySite = ({ proxy }) => {
  const mySitePageNo = ref(1);
  const mySitePageSize = ref(27);
  const mySitePageCount = ref(1);
  const mySiteList = ref([]);

  // 请求我的网站数据
  const getMySiteList = async () => {
    try {
      let params = {
        pageNo: mySitePageNo.value,
        pageSize: mySitePageSize.value,
      };
      let { data } = await api.getMySiteList(params);
      if (data && data.code === 0) {
        data = data.data;
        mySiteList.value = data.list;
        mySitePageCount.value = data.totalPage;
      }
    } catch (e) {
      console.log(e);
      mySiteList.value = [];
    }
  };

  // 翻页
  const mySitePageChange = (pageNo) => {
    mySitePageNo.value = pageNo;
    getMySiteList();
  };

  // 重新请求
  const reLoadMySite = () => {
    mySitePageNo.value = 1;
    mySitePageCount.value = 1;
    mySiteList.value = [];
    getMySiteList();
  };

  proxy.$eventEmitter.on("refreshMySite", reLoadMySite);

  onUnmounted(() => {
    proxy.$eventEmitter.off("refreshMySite", reLoadMySite);
  });

  getMySiteList();

  return {
    mySitePageNo,
    mySitePageSize,
    mySiteList,
    mySitePageCount,
    mySitePageChange,
  };
};

const { store, router, proxy, myColor, themeColor, userInfo } = useInit();
const { isAppletMinimize } = useApplet({ proxy });
const { btnList, onBtnClick, isLoading } = useBtn({
  proxy,
  userInfo,
  router,
  isAppletMinimize,
});
const { inputText, onInput, onEnter, showDropdown, suggestList } = useSearch({
  store,
});
const { mySitePageNo, mySitePageCount, mySiteList, mySitePageChange } =
  useMySite({ proxy });
</script>

<style lang="less" scoped>
.left {
  .iconBtn {
    position: relative;
    width: 40px;
    height: 38px;
    line-height: 38px;
    cursor: pointer;

    &:hover {
      background-color: var(--site-block-hover-color);
    }

    .icon {
      color: var(--dark-color);
      font-weight: bold;
    }

    &.hot {
      .markIcon {
        background-image: url(http://assets.lxqnsys.com/hot-yellow04.gif);
        background-size: cover;
      }
    }

    .markIcon {
      position: absolute;
      right: 21px;
      top: -7px;
      width: 20px;
      height: 20px;
    }
  }
}

.right {
  .searchInputBox {
    margin-right: 20px;

    .input {
      input {
        width: 150px;
        outline: none;
        color: var(--dark-color);
      }
    }

    .suggestList {
      background-color: var(--light-color);
      border: 1px solid var(--other-dark-color);
      border-top: none;
      z-index: 2;
      top: 39px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      overflow: hidden;
      visibility: hidden;

      &.show {
        visibility: visible;
      }

      .suggestItem {
        height: 20px;
        line-height: 20px;

        &:hover {
          background-color: var(--other-site-block-hover-color);
        }

        a {
          font-size: 12px;
          color: var(--other-dark-color);
          padding: 0 10px;
        }
      }
    }
  }
}

.content {
  padding: 10px;

  .mySiteList {
    .siteList {
      display: flex;
      flex-wrap: wrap;
      .item {
        display: inline-block;
        font-size: 14px;
        width: 111px;
        height: 40px;
        padding: 0 5px;
        transition: all 0.5s ease;

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
            width: 130px;
            font-family: 黑体;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--dark-color);
          }
        }
      }
    }

    .noData {
      height: 50px;
      line-height: 50px;
      color: var(--dark-color);
      cursor: pointer;
    }
  }
}
</style>
