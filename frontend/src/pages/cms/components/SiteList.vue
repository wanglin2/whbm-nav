<template>
  <div style="margin-top: 20px">
    <h1>网站列表</h1>
    <div class="siteListContainer">
      <div class="searchBox">
        <n-input
          v-model:value="searchText"
          type="text"
          placeholder="搜索网站名称"
          clearable
          @keyup.enter="onSearch"
          :on-clear="onSearch"
        />
      </div>
      <div class="siteListTable">
        <div class="row" v-for="item in tableList" :key="item.id">
          <div class="item name">{{ item.sitename }}</div>
          <div class="item url">
            <a :href="item.siteurl" target="_blank">{{ item.siteurl }}</a>
          </div>
          <div class="item icon">
            <div class="upload">
              <img v-if="item.siteIcon" :src="item.siteIcon" alt="" />
              <input
                type="file"
                id="iconFileSelect"
                accept="image/*"
                @change="onIconFileChange($event, item)"
              />
              <label for="iconFileSelect" @paste="onPaste($event, item)"
                >上传网站图标(可直接粘贴图片到此上传)</label
              >
            </div>
          </div>
          <div class="item delete">
            <n-button type="error" @click="deleteSite(item)">删除</n-button>
          </div>
        </div>
      </div>
      <div class="paginationBox">
        <n-pagination
          v-model:page="pageNo"
          show-quick-jumper
          :page-count="totalPage"
          :on-update:page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from "vue";
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
  NPagination,
} from "naive-ui";
import { loadJsResource, handleAliyunUrl } from "@/utils";
import { useOss } from "@/hooks/oss";
import api from "@/api/cms";

const isDev = process.env.NODE_ENV === "development";
const message = useMessage();

let oss = null;
// 上传图片
const uploadImg = (img) => {
  return new Promise(async (resolve) => {
    if (!img) {
      return resolve();
    } else if (typeof img === "string" && /^http/.test(img)) {
      return resolve(img);
    }
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

// 获取列表数据
const pageNo = ref(1);
const pageSize = ref(20);
const totalPage = ref(0);
const tableList = ref([]);
const searchText = ref("");

const getTableList = async () => {
  try {
    tableList.value = [];
    let { data } = await api.getSiteList({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      name: searchText.value,
    });
    totalPage.value = data.data.totalPage;
    tableList.value = data.data.list;
  } catch (e) {
    console.log(e);
    tableList.value = [];
    totalPage.value = 0;
  }
};
getTableList();

const onPageChange = (page) => {
  pageNo.value = page;
  getTableList();
};

// 搜索
const onSearch = () => {
  nextTick(() => {
    console.log("搜索", searchText.value);
    pageNo.value = 1;
    getTableList();
  });
};

// 更新网站信息
const updateSiteInfo = async (item) => {
  try {
    let formData = new FormData();
    Object.keys(item).forEach((key) => {
      formData.append(key, item[key]);
    });
    await api.updateSite(formData);
    message.success("保存成功");
    getTableList();
  } catch (e) {
    message.error("保存失败");
  }
};

// 上传图片
const uploadImage = async (file, item) => {
  message.info("正在上传");
  let imgUrl = await uploadImg(file);
  updateSiteInfo({
    ...item,
    siteIcon: imgUrl,
  });
};

// 文件选择变化
const onIconFileChange = async (e, item) => {
  uploadImage(e.target.files[0], item);
};

// 粘贴图片
const onPaste = async (e, item) => {
  let items = e.clipboardData.items;
  let len = items.length;
  if (len <= 0) {
    return;
  }
  let file = null;
  for (let i = 0; i < len; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      file = items[i].getAsFile();
      break;
    }
  }
  if (file) {
    uploadImage(file, item);
  }
};

// 删除
const deleteSite = async (item) => {
  try {
    await api.deleteSite({
      id: item.id,
    });
    message.success("删除成功");
    getTableList();
  } catch (e) {
    message.error("保存失败");
  }
};
</script>

<style lang="less" scoped>
h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.siteListContainer {
  .searchBox {
    margin-bottom: 10px;
  }

  .siteListTable {
    width: 800px;
    height: 500px;
    overflow: auto;
    border: 1px solid rgba(239, 239, 245, 1);

    .row {
      width: 100%;
      display: flex;
      height: 40px;
      border-bottom: 1px solid rgba(239, 239, 245, 1);
      align-items: center;
      overflow: hidden;

      &:hover {
        background-color: #f5f5f5;
      }

      .item {
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex-shrink: 0;
        padding: 0 10px;
        border-right: 1px solid rgba(239, 239, 245, 1);
        display: flex;
        align-items: center;
      }

      .name {
        width: 130px;
      }

      .url {
        flex-grow: 1;
        flex-shrink: 1;
      }

      .icon {
        width: 300px;
        height: 100%;

        .upload {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          input {
            display: none;
          }

          label {
            display: block;
            height: 35px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            flex-grow: 1;
          }

          img {
            height: 30px;
            margin-right: 10px;
          }
        }
      }
    }
  }

  .paginationBox {
    margin-top: 10px;
  }
}
</style>
