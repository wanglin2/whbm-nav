<template>
  <n-drawer v-model:show="drawerShow" :width="400">
    <n-drawer-content title="网站大全" closable class="siteLibraryDrawer">
      <div class="siteLibraryBox h-full relative">
        <div class="searchBox w-full flex items-center">
          <div class="inputBox w-full flex">
            <span
              class="
                icon
                inline-block
                flex
                justify-center
                items-center
                iconfont
                icon-wxbsousuotuiguang
              "
            ></span>
            <input
              class="input w-full"
              type="text"
              placeholder="搜索网站"
              :value="searchText"
              @input="onSearchInput"
            />
          </div>
        </div>
        <div class="siteBox absolute left-0 bottom-0 w-full">
          <div class="siteBar absolute left-0 top-0 bottom-0">
            <div
              v-if="activeType === 'search'"
              class="item w-full flex items-center"
              :class="{ active: activeType === 'search' }"
            >
              <span
                class="
                  icon
                  iconfont
                  flex
                  justify-center
                  items-center
                  icon-sousuo
                "
              ></span>
              <span class="name">搜索结果</span>
            </div>
            <div
              class="item w-full flex items-center"
              v-for="item in typeList"
              :key="item.value"
              :class="{ active: activeType === item.value }"
              @click="changeType(item)"
            >
              <span
                class="icon iconfont flex justify-center items-center"
                :class="[item.icon]"
              ></span>
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
          <div
            class="siteList absolute right-0 top-0 bottom-0"
            @scroll="checkBottomFn"
            ref="scrollEl"
          >
            <div
              class="item flex flex-col"
              v-for="(item, index) in listShow"
              :key="index"
            >
              <div class="header flex items-center">
                <div
                  class="
                    logo
                    relative
                    rounded-1/2
                    flex
                    justify-center
                    items-center
                    flex-shrink-0
                  "
                >
                  <img
                    v-if="!item.error"
                    class="rounded-1/2"
                    :src="'http://assets.lxqnsys.com/icons/' + item.icon"
                    @error="imgLoadError(item, index)"
                  />
                  <span class="text font-bold" v-else>{{
                    item.name.substring(0, 1)
                  }}</span>
                </div>
                <div class="title">{{ item.name }}</div>
              </div>
              <div class="desc">
                {{ item.description === "none" ? "" : item.description }}
              </div>
              <div class="btn flex justify-end">
                <n-button @click="visit(item)">访问</n-button>
              </div>
            </div>
            <div class="tip text-center">{{ tip }}</div>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent, NButton } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { computed, ref, watch } from "vue";
import api from "@/api";
import { useLazyLoadList } from "@/hooks/lazyLoadList";
import { typeList } from "@/config/constants";
import { openUrl } from "@/utils";
import _ from "lodash";

// 搜索
const useSearch = ({ activeType, reload }) => {
  const searchText = ref("");
  const onSearchInput = _.debounce((e) => {
    searchText.value = e.target.value.trim();
    if (searchText.value) {
      activeType.value = "search";
    } else {
      activeType.value = typeList[0].value;
    }
    reload();
  }, 300);
  watch(activeType, (val, oldVal) => {
    if (val !== "search" && oldVal == "search") {
      searchText.value = "";
    }
  });

  return {
    searchText,
    onSearchInput,
  };
};

// 网站列表
const useList = ({ drawerShow, getList, list }) => {
  const inited = ref(false);
  watch(drawerShow, (val) => {
    if (val && !inited.value) {
      inited.value = true;
      getList();
    }
  });
  const listShow = computed(() => {
    return list.value.map((item) => {
      return {
        ...item,
      };
    });
  });
  const imgLoadError = (item, index) => {
    list.value[index].error = true;
  };
  const visit = (item) => {
    openUrl(item.url);
  };

  return {
    listShow,
    imgLoadError,
    visit,
  };
};

// 分类列表
const useTypeList = ({ reload }) => {
  const activeType = ref(typeList[0].value);
  const changeType = (item) => {
    activeType.value = item.value;
    reload();
  };

  return {
    activeType,
    changeType,
  };
};

const { drawerShow } = usrDrawer("siteLibraryDrawer");
const { list, getList, scrollEl, checkBottomFn, tip, reload } = useLazyLoadList(
  {
    api: api.getLibrarySiteList,
    plusParams: () => {
      return {
        type: activeType.value,
        searchKey: searchText.value,
      };
    },
  }
);
const { listShow, imgLoadError, visit } = useList({
  drawerShow,
  getList,
  list,
});
const { activeType, changeType } = useTypeList({ reload });
const { searchText, onSearchInput } = useSearch({ activeType, reload });
</script>

<style lang="less" scoped>
.siteLibraryDrawer {
  /deep/ .n-drawer-body-content-wrapper {
    padding: 0;
  }
}

.siteLibraryBox {
  overflow: hidden;
  background-color: var(--site-library-background-color);
  padding: 0 20px;

  .searchBox {
    height: 75px;

    .inputBox {
      height: 37px;
      background-color: var(--other-light-color);

      .icon {
        width: 44px;
      }

      .input {
        outline: none;
        color: var(--other-dark-color);
      }
    }
  }

  .siteBox {
    top: 75px;

    .siteBar {
      width: 160px;
      background-color: var(--other-light-color);
      padding: 10px 6px 20px 10px;
      overflow: auto;

      .item {
        height: 40px;
        padding: 0px 12px;
        color: var(--other-dark-color);
        cursor: pointer;

        &:hover {
          background-color: var(--other-site-block-hover-color);
          border-radius: 6px;
        }

        &.active {
          background-color: var(--other-site-block-hover-color);
          border-radius: 6px;
          font-weight: bold;
          font-size: 18px;
        }

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }

        .name {
        }
      }
    }

    .siteList {
      left: 160px;
      overflow: auto;
      padding: 20px;

      .item {
        padding: 8px 16px 12px;
        background-color: var(--other-light-color);
        border-radius: 6px;
        margin-bottom: 32px;

        &:last-of-type {
          margin-bottom: 0px;
        }

        .header {
          height: 20px;

          .logo {
            margin-top: -8px;
            width: 52px;
            height: 52px;
            background-color: var(--other-light-color);

            img {
              width: 40px;
              height: 40px;
              object-fit: cover;
            }
          }

          .title {
            max-width: 120px;
            margin-right: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 20px;
            font-size: 14px;
            font-weight: 500;
            color: var(--other-dark-color);
            line-height: 20px;
          }
        }

        .desc {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-top: 16px;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 400;
          color: var(--weak-dark-color);
          line-height: 18px;
        }
      }
    }
  }

  .listBox {
    bottom: 0;
    top: 0px;
    overflow: auto;

    .tip {
      color: var(--weak-dark-color);
    }
  }
}
</style>
