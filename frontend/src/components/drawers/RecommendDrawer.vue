<template>
  <n-drawer v-model:show="drawerShow" :width="300">
    <n-drawer-content title="推荐网站" closable>
      <div class="recommendBox h-full relative">
        <!-- 输入部分 -->
        <div class="siteInputBox">
          <n-form :model="model" ref="formRef" :rules="rules">
            <n-form-item path="name" label="网站名称">
              <n-input v-model:value="model.name" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="url" label="网站地址">
              <n-input v-model:value="model.url" @keydown.enter.prevent />
            </n-form-item>
          </n-form>
          <n-button type="success" @click="confirm">添加</n-button>
        </div>
        <!-- 推荐列表 -->
        <div
          class="listBox absolute w-full bottom-0"
          @scroll="checkBottomFn"
          ref="scrollEl"
        >
          <CardInfo
            v-for="item in listShow"
            :key="item.id"
            :list="item.list"
            :noWrap="true"
          >
            <div class="tag absolute text-center" v-if="item.ispass === '1'">
              已添加
            </div>
          </CardInfo>
          <div class="tip text-center">{{ tip }}</div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import {
  NDrawer,
  NDrawerContent,
  NButton,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { ref, watch, computed } from "vue";
import api from "@/api";
import { useInput } from "@/hooks/addSite";
import CardInfo from "@c/CardInfo";
import { useLazyLoadList } from "@/hooks/lazyLoadList";

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
        list: [
          {
            name: "名称",
            value: item.sitename,
          },
          {
            name: "网址",
            value: item.siteurl,
            isLink: true
          },
          {
            name: "推荐人",
            value: item.reuser,
          },
          {
            name: "时间",
            value: item.time,
          },
        ],
      };
    });
  });

  return {
    listShow,
  };
};

// 添加
const useAdd = ({ formRef, model, reset, reload }) => {
  const message = useMessage();
  // 添加
  const addSite = async () => {
    try {
      let formData = new FormData();
      formData.append("siteName", model.name);
      formData.append("siteUrl", model.url);
      let { data } = await api.addRecommendSite(formData);
      if (data && data.code === 0) {
        message.success("添加成功");
        reset();
        reload();
      } else {
        message.error(data && data.msg ? data.msg : "添加失败，请重试");
      }
    } catch (e) {
      console.log(e);
      message.error("添加失败，请重试");
    }
  };
  // 确认添加
  const confirm = () => {
    formRef.value.validate((errors) => {
      if (!errors) {
        addSite();
      } else {
        message.error("请输入正确");
      }
    });
  };

  return {
    confirm,
  };
};

const { drawerShow } = usrDrawer("recommendDrawer");
const { list, getList, scrollEl, checkBottomFn, tip, reload } = useLazyLoadList(
  { api: api.getRecommendSiteList }
);
const { listShow } = useList({ drawerShow, getList, list });
const { formRef, model, rules, reset } = useInput();
const { confirm } = useAdd({
  formRef,
  model,
  reset,
  reload,
});
</script>

<style lang="less" scoped>
.recommendBox {
  overflow: hidden;

  .listBox {
    bottom: 0;
    top: 210px;
    overflow: auto;

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

    .tip {
      color: var(--weak-dark-color);
    }
  }
}
</style>
