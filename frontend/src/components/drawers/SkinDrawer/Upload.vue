<template>
  <div
    class="imgUploadContainer w-full h-full flex justify-center items-center"
  >
    <div class="imgUploadPanel relative w-full">
      <div class="upBtn" v-if="!uploadImageUrl">
        <label
          for="imgUploadInput"
          class="imgUploadInputArea w-full text-center flex justify-center items-center"
          @dragenter.stop.prevent
          @dragover.stop.prevent
          @drop.stop.prevent="onDrop"
          @paste="onPaste"
          >点击此处选择图片、或拖动图片到此</label
        >
        <input
          type="file"
          accept="image/*"
          id="imgUploadInput"
          @change="onImgUploadInputChange"
        />
      </div>
      <div v-if="uploadImageUrl" class="uploadInfoBox relative w-full">
        <div
          class="previewBox w-full h-full"
          :style="{ backgroundImage: `url('${uploadImageUrl}')` }"
        ></div>
        <div
          class="delBtn absolute right-0 top-0 flex justify-center items-center"
          @click="deleteImg"
        >
          <NIcon>
            <Trash></Trash>
          </NIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed, watch, defineExpose } from "vue";
import { Trash } from "@vicons/fa";
import { NIcon, useMessage } from "naive-ui";
import { loadJsResource, handleAliyunUrl } from "@/utils";
import { useOss } from "@/hooks/oss";
const isDev = process.env.NODE_ENV === "development";

// 上传图片设置
const useUploadImage = ({ store }) => {
  const userConfigUpload = computed(() => {
    return store.state.userConfig &&
      store.state.userConfig.theme.type === "upload"
      ? store.state.userConfig.theme.upload
      : null;
  });
  const uploadImageUrl = ref(
    userConfigUpload.value ? userConfigUpload.value.url : ""
  );
  watch(
    userConfigUpload,
    () => {
      if (userConfigUpload.value) {
        uploadImageUrl.value = userConfigUpload.value.url;
      } else {
        uploadImageUrl.value = "";
      }
    },
    {
      deep: true,
    }
  );

  return {
    uploadImageUrl,
  };
};

// 图片上传
const useUploadImg = ({ uploadImageUrl }) => {
  const message = useMessage();
  let fileObj = null;
  let oss = null;
  // 上传图片
  const uploadImage = () => {
    return new Promise(async (resolve) => {
      if (
        typeof uploadImageUrl.value === "string" &&
        /^http/.test(uploadImageUrl.value)
      ) {
        return resolve(uploadImageUrl.value);
      }
      if (!fileObj) {
        message.warning("请选择图片");
        return resolve(null);
      }
      await loadJsResource([]);
      if (!oss) {
        oss = useOss();
      }
      oss.uploadFile(
        fileObj,
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

  // 预览图片
  const previewImage = (file) => {
    let fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = (e) => {
      uploadImageUrl.value = e.target.result;
    };
  };

  // 选择图片
  const selectImg = (file) => {
    fileObj = file;
    previewImage(file);
  };

  // 图片选择事件
  const onImgUploadInputChange = (e) => {
    let file = e.target.files[0];
    selectImg(file);
  };

  // 拖动上传图片
  const onDrop = (e) => {
    let dt = e.dataTransfer;
    let file = dt.files && dt.files[0];
    selectImg(file);
  };

  // 粘贴图片
  const onPaste = async (e) => {
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
      selectImg(file);
    }
  };

  // 删除图片
  const deleteImg = () => {
    fileObj = null;
    uploadImageUrl.value = "";
  };

  return {
    onImgUploadInputChange,
    onDrop,
    onPaste,
    deleteImg,
    uploadImage,
  };
};

const store = useStore();
const { uploadImageUrl } = useUploadImage({ store });
const { onImgUploadInputChange, onDrop, onPaste, deleteImg, uploadImage } =
  useUploadImg({
    uploadImageUrl,
  });
defineExpose({
  uploadImage,
  uploadImageUrl,
});
</script>

<style lang="less" scoped>
.imgUploadContainer {
  z-index: 1000;

  .imgUploadPanel {
    font-size: 22px;
    white-space: nowrap;
    cursor: default;
    user-select: none;

    .imgUploadInputArea {
      height: 200px;
      font-size: 20px;
      color: var(--weak-dark-color);
      background-color: var(--site-block-hover-color);
      border: none;
      outline: none;
      cursor: pointer;
      white-space: normal;
      padding: 10px;
    }

    #imgUploadInput {
      display: none;
    }

    .uploadInfoBox {
      height: 200px;
      background-color: var(--site-block-hover-color);

      .previewBox {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .delBtn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        color: var(--other-dark-color);
        font-size: 14px;
        background-color: var(--light-color);
      }
    }
  }
}
</style>
