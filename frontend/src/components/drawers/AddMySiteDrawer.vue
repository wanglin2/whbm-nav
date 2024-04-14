<template>
  <n-drawer v-model:show="drawerShow" :width="300">
    <n-drawer-content title="添加网站" closable>
      <!-- 输入部分 -->
      <div class="siteInputBox">
        <n-form :model="model" ref="formRef" :rules="rules">
          <n-form-item path="name" label="网站名称">
            <n-input v-model:value="model.name" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="url" label="网站地址">
            <n-input v-model:value="model.url" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="desc" label="网站简介">
            <n-input v-model:value="model.desc" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="icon" label="网站图标">
            <div>
              <div class="w-full h-[200px]">
                <ImgUpload ref="uploadComp"></ImgUpload>
              </div>
              <div class="text-[#999] mt-[10px]" style="word-break: break-all">
                网站图标地址一般为【网址+/favicon.ico】。<a :href="siteIconUrl" target="_blank" v-if="model.url"
                  style="color: #87BDFF">点此查看你输入的网站图标</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
      <!-- 添加部分 -->
      <div class="addBox">
        <div class="header flex">
          <n-radio :checked="addTypeCheckedValue === 'mySite'" @change="handleAddTypeChange" value="mySite"
            name="addType">添加到我的空间</n-radio>
          <n-radio :checked="addTypeCheckedValue === 'myClass'" @change="handleAddTypeChange" value="myClass"
            name="addType">添加到我的分类</n-radio>
        </div>
        <div class="content">
          <keep-alive>
            <n-tree v-if="addTypeCheckedValue === 'myClass'" block-line :data="userClassTree" selectable remote
              :selected-keys="selectedClassTagKeys" :on-update:selected-keys="onUpdateSelectedClassTagKeys"
              :on-load="handleLoadUserClassTree" />
          </keep-alive>
        </div>
        <div class="footer">
          <n-button type="success" @click="confirm">添加</n-button>
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
  NRadio,
  useMessage,
  NTree,
} from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import { ref, getCurrentInstance, h, watch, computed } from "vue";
import api from "@/api";
import { useInput } from '@/hooks/addSite';
import ImgUpload from '../ImgUpload.vue';

// 用户分类数据
const useUserClassData = () => {
  const userClassTree = ref([]);
  const selectedClassTagKeys = ref([]);
  let isLoadClass = false;
  // 通过key获取分类和标签数据
  const getClassTagDataByKey = (key) => {
    let classId = "";
    let tagId = "";
    userClassTree.value.forEach((item) => {
      if (item.key === key) {
        classId = item.id;
      } else if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          if (child.key === key) {
            classId = item.id;
            tagId = child.id;
          }
        });
      }
    });

    return {
      classId,
      tagId,
    };
  };
  // 获取分类数据
  const getClassList = async (reload) => {
    try {
      if (isLoadClass && !reload) {
        return;
      }
      isLoadClass = true;
      let { data } = await api.getUserClass();
      if (data.code === 0 && data.data && data.data.length > 0) {
        userClassTree.value = data.data.map((item) => {
          return {
            id: item.id,
            label: item.className,
            key: "class_" + item.id,
            isLeaf: false,
            prefix: () => {
              return h("span", {
                className: "iconfont icon-fenlei",
              });
            },
          };
        });
      }
    } catch (e) {
      console.log(e);
      isLoadClass = false;
    }
  };
  // 加载标签数据
  const handleLoadUserClassTree = async (node) => {
    try {
      let { data } = await api.getUserTag({
        classId: getClassTagDataByKey(node.key).classId,
      });
      if (data.code === 0 && data.data && data.data.length > 0) {
        node.children = data.data.map((item) => {
          return {
            id: item.id,
            label: item.tagName,
            key: "tag_" + item.id,
            isLeaf: true,
            prefix: () => {
              return h("span", {
                className: "iconfont icon-biaoqian",
              });
            },
          };
        });
      } else {
        node.children = [];
      }
    } catch (e) {
      node.children = [];
    }
  };
  // 切换选中的分类/标签
  const onUpdateSelectedClassTagKeys = (keys) => {
    selectedClassTagKeys.value = keys;
  };

  return {
    userClassTree,
    selectedClassTagKeys,
    getClassList,
    handleLoadUserClassTree,
    onUpdateSelectedClassTagKeys,
    getClassTagDataByKey,
  };
};

// 添加
const useAdd = ({
  formRef,
  model,
  reset,
  getClassList,
  selectedClassTagKeys,
  userClassTree,
  drawerShow,
}) => {
  const { proxy } = getCurrentInstance();
  const message = useMessage();
  const addTypeCheckedValue = ref("mySite");
  const uploadComp = ref(null);
  // 类型切换
  const handleAddTypeChange = (e) => {
    addTypeCheckedValue.value = e.target.value;
    if (addTypeCheckedValue.value === "myClass") {
      getClassList();
    }
  };
  // 当抽屉重新打开
  watch(drawerShow, (val, oldVal) => {
    if (val && !oldVal) {
      getClassList(true);
    }
  });
  // 添加到我的空间
  const addToMySite = async (icon) => {
    try {
      let { data } = await api.addUserSite({
        siteName: model.name,
        siteUrl: model.url,
        siteDesc: model.desc,
        siteIcon: icon
      });
      if (data && data.code === 0) {
        message.success("添加成功");
        reset();
        uploadComp.value.reset();
        proxy.$eventEmitter.emit("refreshMySite");
      } else {
        message.error(data && data.msg ? data.msg : "添加失败，请重试");
      }
    } catch (e) {
      console.log(e);
      message.error("添加失败，请重试");
    }
  };
  // 添加到我的分类
  const addToMyClass = async (icon) => {
    try {
      if (userClassTree.value.length <= 0) {
        message.warning("暂未创建分类或标签，请先创建");
        return;
      }
      if (selectedClassTagKeys.value.length <= 0) {
        message.warning("请选择要添加到的分类或标签");
        return;
      }
      let { classId, tagId } = getClassTagDataByKey(
        selectedClassTagKeys.value[0]
      );
      let { data } = await api.addUserClassTagSite({
        siteName: model.name,
        siteUrl: model.url,
        siteDesc: model.desc,
        siteIcon: icon,
        classId,
        tagId,
      });
      if (data && data.code === 0) {
        message.success("添加成功");
        reset();
        uploadComp.value.reset();
        proxy.$eventEmitter.emit("refreshUserClassSite", { classId, tagId });
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
    formRef.value.validate(async (errors) => {
      if (!errors) {
        let icon = ''
        if (uploadComp.value.uploadImageUrl) {
          icon = await uploadComp.value.uploadImage();
        }
        switch (addTypeCheckedValue.value) {
          case "mySite":
            addToMySite(icon);
            break;
          default:
            addToMyClass(icon);
            break;
        }
      } else {
        message.error("请输入正确");
      }
    });
  };

  return {
    addTypeCheckedValue,
    handleAddTypeChange,
    confirm,
    uploadComp
  };
};

const siteIconUrl = computed(() => {
  if (!model.url) {
    return;
  }
  let url = new URL(model.url)
  return url.origin + '/favicon.ico';
})

const { drawerShow } = usrDrawer("addMySiteDrawer");
const { formRef, model, rules, reset } = useInput();
const {
  userClassTree,
  selectedClassTagKeys,
  getClassList,
  handleLoadUserClassTree,
  onUpdateSelectedClassTagKeys,
  getClassTagDataByKey,
} = useUserClassData();
const { addTypeCheckedValue, handleAddTypeChange, confirm, uploadComp } = useAdd({
  formRef,
  model,
  reset,
  getClassList,
  selectedClassTagKeys,
  getClassTagDataByKey,
  userClassTree,
  drawerShow,
});
</script>

<style lang="less" scoped>
.addBox {
  .content {
    padding: 10px 0;
  }

  .footer {
    margin-top: 50px;
  }
}
</style>
