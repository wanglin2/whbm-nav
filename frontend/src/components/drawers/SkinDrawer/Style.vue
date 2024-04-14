<template>
  <div class="styleContainer">
    <n-radio-group v-model:value="skinType" name="radiobuttongroup1">
      <n-radio-button value="default">默认</n-radio-button>
      <n-radio-button value="skin">皮肤</n-radio-button>
      <n-radio-button value="image">图片</n-radio-button>
      <n-radio-button value="color">纯色</n-radio-button>
      <n-radio-button value="upload">上传</n-radio-button>
    </n-radio-group>
    <div class="componentBox">
      <Skin ref="skinComp" v-if="skinType === 'skin'"></Skin>
      <Image ref="imageComp" v-if="skinType === 'image'"></Image>
      <Color ref="colorComp" v-if="skinType === 'color'"></Color>
      <Upload ref="uploadComp" v-if="skinType === 'upload'"></Upload>
    </div>
    <div class="btnBox">
      <n-button type="primary" @click="confirmStyle">确定</n-button>
    </div>
  </div>
</template>

<script setup>
import { NRadioGroup, NRadioButton, NButton, useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";
import Skin from "./Skin";
import Image from "./Image";
import Color from "./Color";
import Upload from "./Upload";
import { useStore } from "vuex";

// tab
const useTab = ({ store }) => {
  const userConfig = computed(() => {
    return store.state.userConfig ? store.state.userConfig.theme.type : "";
  });
  const skinType = ref(userConfig.value);
  watch(userConfig, () => {
    skinType.value = userConfig.value;
  });

  return {
    skinType,
  };
};

// 设置
const useSetting = ({ store, skinType }) => {
  const message = useMessage();
  const skinComp = ref(null);
  const imageComp = ref(null);
  const colorComp = ref(null);
  const uploadComp = ref(null);
  // 确认
  const confirmStyle = async () => {
    let type = skinType.value;
    let data = {};
    let pass = true;
    switch (skinType.value) {
      case "default":
        break;
      case "skin":
        data.skin = {
          url: skinComp.value.activeSkinUrl,
          color: skinComp.value.activeSkinColor,
        };
        break;
      case "image":
        if (imageComp.value.randomImage) {
          data.image = {
            random: true,
            url: "",
          };
        } else {
          if (!imageComp.value.selectedImageUrl) {
            pass = false;
            message.warning("请选择图片");
          } else {
            data.image = {
              random: false,
              url: imageComp.value.selectedImageUrl,
            };
          }
        }
        break;
      case "color":
        if (!colorComp.value.preinstallColor && !colorComp.value.customColor) {
          pass = false;
          message.warning("请选择颜色");
        } else if (colorComp.value.customColor) {
          data.color = {
            custom: true,
            color: colorComp.value.customColor,
          };
        } else {
          data.color = {
            custom: false,
            color: colorComp.value.preinstallColor,
          };
        }
        break;
      case "upload":
        let res = await uploadComp.value.uploadImage();
        if (res) {
          data.upload = {
            url: res,
          };
        } else {
          pass = false;
        }
        break;
      default:
        break;
    }
    if (!pass) {
      return;
    }
    await store.dispatch("updateUserConfig", {
      theme: {
        ...store.state.userConfig.theme,
        type,
        ...data,
      },
    });
    message.success('设置成功')
  };

  return {
    skinComp,
    imageComp,
    colorComp,
    uploadComp,
    confirmStyle,
  };
};

const store = useStore();
const { skinType } = useTab({ store });
const { skinComp, imageComp, colorComp, uploadComp, confirmStyle } = useSetting(
  {
    store,
    skinType,
  }
);
</script>

<style lang="less" scoped>
.styleContainer {
  padding-bottom: 50px;

  .componentBox {
    margin-top: 12px;
  }

  .btnBox {
    height: 50px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: var(--light-color);
    padding: 0 24px;
    display: flex;
    align-items: center;
    z-index: 9;
  }
}
</style>
