<template>
  <div>
    <!-- 小程序列表 -->
    <h1>小程序列表</h1>
    <div class="appletListContainer">
      <div
        class="appletItem"
        v-for="item in appletList"
        :key="item.id"
        @click="editApplet(item)"
      >
        <div class="iconBox">
          <img :src="item.icon" alt="" />
        </div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="name">{{ item.name }}</div>
          </template>
          {{ item.descs }}
        </n-tooltip>
      </div>
    </div>
    <!-- 表单 -->
    <h1>注册小程序</h1>
    <n-form
      :model="model"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      size="medium"
      :style="{
        maxWidth: '550px',
      }"
    >
      <n-form-item label="名称" path="name">
        <n-input placeholder="名称" v-model:value="model.name" />
      </n-form-item>
      <n-form-item label="描述" path="descs">
        <n-input
          placeholder="描述"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
          v-model:value="model.descs"
        />
      </n-form-item>
      <n-form-item label="url" path="url">
        <n-input
          placeholder="入口url，如：http://lxqnsys.com/d/applets/xxx/comp.umd.js"
          v-model:value="model.url"
        />
      </n-form-item>
      <n-form-item label="测试环境url" path="devUrl">
        <n-input placeholder="devUrl" v-model:value="model.devUrl" />
      </n-form-item>
      <n-form-item label="宽度" path="width">
        <n-input placeholder="宽度" v-model:value="model.width" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-radio-group v-model:value="model.type">
          <n-radio-button value="microApp">微前端</n-radio-button>
          <n-radio-button value="comp">Vue组件</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <!-- 微前端相关配置开始 -->
      <n-form-item
        label="activeRule"
        path="activeRule"
        v-if="model.type === 'microApp'"
      >
        <n-input
          placeholder="#/index/applet/xxx"
          v-model:value="model.activeRule"
        />
      </n-form-item>
      <!-- 微前端相关配置结束 -->
      <!-- 组件相关配置开始 -->
      <n-form-item label="样式url" path="styleUrl" v-if="model.type === 'comp'">
        <n-input
          v-model:value="model.styleUrl"
          placeholder="http://lxqnsys.com/d/applets/xxx/comp.css"
        />
      </n-form-item>
      <n-form-item
        label="测试环境样式url"
        path="devStyleUrl"
        v-if="model.type === 'comp'"
      >
        <n-input v-model:value="model.devStyleUrl" />
      </n-form-item>
      <!-- 组件相关配置结束 -->
      <n-form-item label="图标" path="icon">
        <n-upload
          v-model:file-list="model.icon"
          list-type="image-card"
          accept="image/*"
          :max="1"
          :default-upload="false"
        >
          点击上传
        </n-upload>
      </n-form-item>
      <n-form-item label="是否需要登录" path="needLogin">
        <n-radio-group v-model:value="model.needLogin">
          <n-radio-button :value="1">是</n-radio-button>
          <n-radio-button :value="0">否</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="是否发布" path="isPublish">
        <n-radio-group v-model:value="model.isPublish">
          <n-radio-button :value="1">是</n-radio-button>
          <n-radio-button :value="0">否</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-form>
    <div class="btnGroup">
      <n-button :loading="loading" :disabled="loading" @click="register"
        >注册</n-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadioButton,
  NUpload,
  NButton,
  useMessage,
  NTooltip,
} from "naive-ui";
import { loadJsResource, handleAliyunUrl } from "@/utils";
import { useOss } from "@/hooks/oss";
import api from "@/api/cms";
import indexApi from "@/api";

const isDev = process.env.NODE_ENV === "development";
const message = useMessage();

// 表单
const model = reactive({
  id: "",
  name: "",
  descs: "",
  url: "",
  width: "450",
  type: "microApp",
  activeRule: "",
  icon: [],
  styleUrl: "",
  devStyleUrl: "",
  devUrl: "",
  isPublish: 0,
  needLogin: 0,
});

let oss = null;
const uploadImg = (img) => {
  return new Promise(async (resolve) => {
    if (!img) {
      return resolve();
    } else if (typeof img === "string" && /^http/.test(img)) {
      return resolve(img);
    } else if (img.url) {
      return resolve(img.url);
    }
    img = img.file;
    await loadJsResource([]);
    if (!oss) {
      oss = useOss();
    }
    oss.uploadFile(
      img,
      () => {},
      async (ev) => {
        console.log(ev);
        if (ev && ev.length > 0) {
          let imgUrl = handleAliyunUrl(ev[0].name);
          resolve(imgUrl);
        }
      },
      (ev) => {
        if (ev.length > 0) {
          message.warning("图片上传失败，请重试");
          resolve(null);
        }
      }
    );
  });
};

const reset = ({
  name,
  descs,
  url,
  width,
  type,
  activeRule,
  icon,
  styleUrl,
  devStyleUrl,
  devUrl,
  isPublish,
  id,
  needLogin,
} = {}) => {
  model.id = id || "";
  model.name = name || "";
  model.descs = descs || "";
  model.url = url || "";
  model.width = width || "450";
  model.type = type || "microApp";
  model.activeRule = activeRule || "";
  model.icon = icon
    ? [
        {
          id: icon,
          name: icon,
          url: icon,
          status: "finished",
        },
      ]
    : [];
  model.styleUrl = styleUrl || "";
  model.devStyleUrl = devStyleUrl || "";
  model.devUrl = devUrl || "";
  model.isPublish =
    isPublish === undefined || isPublish === null ? 0 : Number(isPublish);
  model.needLogin =
    needLogin === undefined || needLogin === null ? 0 : Number(needLogin);
};

const loading = ref(false);
const register = async () => {
  try {
    loading.value = true;
    let imgUrl = "";
    if (model.icon.length > 0) {
      imgUrl = await uploadImg(model.icon[0]);
    }
    let formData = new FormData();
    Object.keys(model).forEach((key) => {
      if (key === "icon") {
        formData.append("icon", imgUrl);
      } else {
        formData.append(key, model[key]);
      }
    });
    let { data } = await api.register(formData);
    loading.value = false;
    if (data.code === 0) {
      message.success("保存成功");
      getAppletList();
      reset();
    } else {
      message.success("保存失败");
    }
  } catch (e) {
    loading.value = false;
  }
};

// 小程序列表
const appletList = ref([]);

const getAppletList = async () => {
  try {
    let { data } = await indexApi.getAppletList();
    appletList.value = data.data || [];
  } catch (error) {
    console.log(error);
  }
};
getAppletList();

const editApplet = (item) => {
  reset(item);
};
</script>

<style lang="less" scoped>
.btnGroup {
  padding-left: 100px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.appletListContainer {
  display: flex;
  flex-wrap: wrap;

  .appletItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-right: 30px;
    margin-bottom: 30px;

    .iconBox {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .name {
    }
  }
}
</style>
