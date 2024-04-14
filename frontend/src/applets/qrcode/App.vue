<template>
  <el-config-provider :locale="zhCn">
    <div class="qrcodeContainer">
      <div class="block">
        <h1>二维码生成器</h1>
        <div class="inputBox">
          <textarea
            placeholder="请输入文字内容"
            maxlength="300"
            v-model="inputText"
          ></textarea>
        </div>
        <div class="outputBox">
          <div class="outputImgBox">
            <div class="output" ref="outputEl"></div>
            <div class="downloadBtn" v-if="createdQRCode">
              <el-button type="success" @click="downloadQRCode"
                >下载图片</el-button
              >
            </div>
          </div>
          <div class="control">
            <div class="row">
              <div class="label">容错</div>
              <div class="item">
                <el-select v-model="createForm.correctLevel" size="small">
                  <el-option
                    v-for="item in correctLevelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">尺寸</div>
              <div class="item">
                <el-select v-model="createForm.size" size="small">
                  <el-option
                    v-for="item in sizeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">前景色</div>
              <div class="item">
                <el-color-picker v-model="createForm.colorDark" />
              </div>
            </div>
            <div class="row">
              <div class="label">背景色</div>
              <div class="item">
                <el-color-picker v-model="createForm.colorLight" />
              </div>
            </div>
          </div>
        </div>
        <div class="btnBox">
          <el-button type="primary" @click="createQRCode">生成二维码</el-button>
        </div>
      </div>
      <div class="block">
        <h1>二维码解析器</h1>
        <div class="fileInputBox">
          <div class="upBtn">
            <label
              for="imgUploadInput"
              class="imgUploadInputArea"
              @dragenter.stop.prevent
              @dragover.stop.prevent
              @drop.stop.prevent="onDrop"
              >点击此处选择图片、或拖动图片到此</label
            >
            <input
              type="file"
              accept="image/*"
              id="imgUploadInput"
              @change="onImgUploadInputChange"
            />
          </div>
        </div>
        <div class="scannerResultBox" v-if="scannerText">
          <div class="scannerResult">{{ scannerText }}</div>
          <div class="btnBox" v-if="scannerText !== '解析失败'">
            <el-button type="primary" @click="copyScannerResult"
              >复制</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import {
  ElButton,
  ElSelect,
  ElOption,
  ElColorPicker,
  ElMessage,
  ElConfigProvider,
} from "element-plus";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/color-picker/style/css";
import "element-plus/es/components/message/style/css";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { onUnmounted, reactive, ref } from "vue";
import { useLoadJsResource } from "@/hooks/load";
import { downloadFile2, copyText } from "@/utils/";

// 创建二维码
const useCreate = ({ load }) => {
  const inputText = ref("");
  const loaded = ref(false);
  const outputEl = ref(null);
  const createForm = reactive({
    correctLevel: "H",
    size: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
  });
  const correctLevelList = reactive([
    {
      label: "7%",
      value: "L",
    },
    {
      label: "15%",
      value: "M",
    },
    {
      label: "25%",
      value: "Q",
    },
    {
      label: "30%",
      value: "H",
    },
  ]);
  const sizeList = reactive([
    {
      label: "128*128像素",
      value: 128,
    },
    {
      label: "300*300像素",
      value: 300,
    },
    {
      label: "500*500像素",
      value: 500,
    },
    {
      label: "1000*1000像素",
      value: 1000,
    },
  ]);
  let qrcode = null;
  const createdQRCode = ref(false);

  // 生成二维码
  const createQRCode = async () => {
    let text = inputText.value.trim();
    if (!text) {
      return ElMessage.warning("请输入文字内容");
    }
    if (!loaded.value) {
      await load(["http://lxqnsys.com/js/qrcode.min.js"]);
    }
    if (qrcode) {
      qrcode.clear();
      qrcode = null;
      outputEl.value.innerHTML = "";
      createdQRCode.value = false;
    }
    qrcode = new window.QRCode(outputEl.value, {
      text: text,
      width: createForm.size,
      height: createForm.size,
      colorDark: createForm.colorDark,
      colorLight: createForm.colorLight,
      correctLevel: window.QRCode.CorrectLevel[createForm.correctLevel],
    });
    createdQRCode.value = true;
  };

  // 下载二维码
  const downloadQRCode = () => {
    if (!createdQRCode.value) {
      return;
    }
    let canvas = outputEl.value.querySelector("canvas");
    downloadFile2(canvas.toDataURL(), "qrcode.png");
  };

  return {
    inputText,
    createQRCode,
    outputEl,
    createForm,
    correctLevelList,
    sizeList,
    downloadQRCode,
    createdQRCode,
  };
};

// 解析二维码
const useScanner = ({ load }) => {
  const loaded = ref(false);
  const scannerText = ref("");

  // 获取解析结果
  const scannerCallback = (e) => {
    if (e === "error decoding QR Code") {
      e = "解析失败";
      ElMessage.error("解析失败");
    } else {
      ElMessage.success("解析成功");
    }
    scannerText.value = e;
  };

  // 复制解析结果
  const copyScannerResult = () => {
    copyText(scannerText.value);
    ElMessage.success("复制成功");
  };

  // 解析二维码
  const scanner = async (file) => {
    if (!file) {
      return;
    }
    if (!loaded.value) {
      await load(["http://lxqnsys.com/js/jsqrcode/jsqrcode.all.js"]);
      window.qrcode.callback = scannerCallback;
    }
    let fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = (e) => {
      window.qrcode.decode(e.target.result);
    };
  };

  // 图片选择事件
  const onImgUploadInputChange = (e) => {
    let file = e.target.files[0];
    scanner(file);
  };

  // 拖动上传图片
  const onDrop = (e) => {
    let dt = e.dataTransfer;
    let file = dt.files && dt.files[0];
    scanner(file);
  };

  return {
    onImgUploadInputChange,
    onDrop,
    scannerText,
    copyScannerResult,
  };
};

// 加载资源
const { load, unload } = useLoadJsResource();
onUnmounted(() => {
  unload();
});
const {
  inputText,
  createQRCode,
  outputEl,
  createForm,
  correctLevelList,
  sizeList,
  downloadQRCode,
  createdQRCode,
} = useCreate({ load });
const { onImgUploadInputChange, onDrop, scannerText, copyScannerResult } =
  useScanner({ load });
</script>

<style lang="less" scoped>
.qrcodeContainer {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;

  .block {
    margin-bottom: 20px;

    h1 {
      font-size: 30px;
      color: #333;
      text-align: center;
      font-weight: 400;
      margin-bottom: 10px;
    }

    .inputBox {
      width: 100%;
      height: 150px;
      margin-bottom: 10px;

      textarea {
        width: 100%;
        height: 100%;
        outline: none;
        resize: none;
        padding: 11px 18px;
        border: 1px solid rgba(120, 130, 140, 0.25);
      }
    }

    .outputBox {
      border: 1px solid #e6e6e6;
      padding: 16px;
      overflow: hidden;
      display: flex;

      .outputImgBox {
        .output {
          width: 128px;
          height: 128px;
          overflow: hidden;
          background-color: #f5f5f5;

          /deep/ img {
            width: 128px;
            height: 128px;
          }
        }

        .downloadBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
        }
      }

      .control {
        margin-left: 20px;
        .row {
          display: flex;
          align-items: center;
          margin-bottom: 5px;

          .label {
            width: 40px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 13px;
            height: 17px;
          }
        }
      }
    }

    .btnBox {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .fileInputBox {
      width: 100%;
      height: 150px;
      margin-bottom: 10px;

      .upBtn {
        width: 100%;
        height: 100%;

        .imgUploadInputArea {
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #imgUploadInput {
          display: none;
        }
      }
    }

    .scannerResultBox {
      .scannerResult {
        background-color: #f5f5f5;
        padding: 16px;
      }
    }
  }
}
</style>