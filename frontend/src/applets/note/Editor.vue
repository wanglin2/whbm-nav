<template>
  <div class="editorContainer" :class="{ readonly: readonly }">
    <div class="editor" ref="editor"></div>
    <div class="toolbarBox" v-show="!readonly">
      <div class="toolbar" ref="toolbar">
        <button class="ql-header" value="1"></button>
        <button class="ql-header" value="2"></button>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-image"></button>
        <button class="ql-link"></button>
        <button class="ql-code-block"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
        <select class="ql-color">
          <option selected></option>
          <option value="red"></option>
          <option value="orange"></option>
          <option value="yellow"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="purple"></option>
        </select>
        <select class="ql-background">
          <option selected></option>
          <option value="red"></option>
          <option value="orange"></option>
          <option value="yellow"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="purple"></option>
        </select>
      </div>
      <div class="buttonBox">
        <div class="button cancel" v-if="edit" @click="cancel">取消</div>
        <div class="button submit" @click="submit">发送</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  watch,
} from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useOss } from "@/hooks/oss";
import { loadJsResource, handleAliyunUrl } from "@/utils";
import { ElMessageBox } from "element-plus";
import "element-plus/es/components/message-box/style/css";
import { Range } from "quill/core/selection";

const LinkBlot = Quill.import("formats/link");
const BackgroundClass = Quill.import("attributors/class/background");
const ColorClass = Quill.import("attributors/class/color");
const SizeStyle = Quill.import("attributors/style/size");
Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);

const props = defineProps({
  // 只读模式
  readonly: {
    type: Boolean,
    default: false,
  },
  // 编辑模式
  edit: {
    type: Boolean,
    default: false,
  },
  // 内容
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", "cancel"]);

// 图片处理程序
const useImageHandler = () => {
  let el = null;
  let oss = null;

  // 上传图片
  const uploadImage = async (file) => {
    await loadJsResource([]);
    return new Promise((resolve) => {
      if (!oss) {
        oss = useOss();
      }
      oss.uploadFile(
        file,
        () => {},
        async (ev) => {
          if (ev && ev.length > 0) {
            let imgUrl = handleAliyunUrl(ev[0].name);
            resolve(imgUrl);
          }
        },
        (ev) => {
          if (ev.length > 0) {
            resolve(null);
          }
        }
      );
    });
  };

  // 插入图片
  const fileChangeHandler = async (e) => {
    let file = e.target.files[0];
    let imgUrl = await uploadImage(file);
    console.log(imgUrl);
    //将图片插入需要获取当前光标的位置，参数为是否要求焦点在编辑器上
    let selection = quill.getSelection(true);
    //调用insertEmbed 将图片插入到编辑器
    quill.insertEmbed(selection.index, "image", imgUrl);
  };

  // 选择图片
  const imageHandler = () => {
    if (!el) {
      el = document.createElement("input");
      el.type = "file";
      el.accept = "image/*";
      el.addEventListener("change", fileChangeHandler);
    }
    el.click();
  };

  return {
    imageHandler,
  };
};

// 初始化编辑器
const editor = ref(null);
const toolbar = ref(null);
let quill = null;
const init = ({ imageHandler }) => {
  let linkRange = null;
  let scrollTop = 0;
  const restoreFocus = () => {
    quill.focus();
    quill.scrollingContainer.scrollTop = scrollTop;
  };
  quill = new Quill(editor.value, {
    scrollingContainer: editor.value,
    modules: {
      toolbar: {
        container: toolbar.value,
        handlers: {
          image: imageHandler,
          link: function (value) {
            if (value) {
              ElMessageBox.prompt("输入URL", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
              })
                .then(({ value }) => {
                  restoreFocus();
                  quill.formatText(linkRange, "link", value, "user");
                  linkRange = null;
                })
                .catch(() => {
                  restoreFocus();
                });
            } else {
              quill.format("link", false);
            }
          },
        },
      },
    },
    theme: "snow",
    readOnly: props.readonly,
  });
  if (props.content) {
    quill.setContents(JSON.parse(props.content));
  }
  watch(
    () => {
      return props.content;
    },
    (val) => {
      quill.setContents(val ? JSON.parse(val) : []);
    }
  );
  watch(
    () => {
      return props.edit;
    },
    (val) => {
      quill.enable(val);
    }
  );
  quill.on("selection-change", function (range, oldRange, source) {
    if (range == null) return;
    linkRange = range;
    scrollTop = quill.scrollingContainer.scrollTop;
    if (range.length === 0 && source === "user") {
      let [link, offset] = quill.scroll.descendant(LinkBlot, range.index);
      if (link != null) {
        linkRange = new Range(range.index - offset, link.length());
        let preview = LinkBlot.formats(link.domNode);
        ElMessageBox.prompt("输入URL", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: preview,
        })
          .then(({ value }) => {
            restoreFocus();
            quill.formatText(linkRange, "link", value, "user");
            linkRange = null;
          })
          .catch(() => {
            restoreFocus();
          });
      }
    }
  });
};

// 操作
const useHandle = () => {
  // 清空
  const clear = () => {
    quill.setContents([]);
  };

  // 提交
  const submit = () => {
    emit("submit", quill.getContents());
  };

  // 取消
  const cancel = () => {
    emit("cancel");
  };

  return {
    clear,
    submit,
    cancel,
  };
};

const { imageHandler } = useImageHandler();
const { clear, submit, cancel } = useHandle();
defineExpose({
  clear,
});
onMounted(() => {
  init({ imageHandler });
});
</script>

<style lang="less" scoped>
.editorContainer {
  width: 100%;

  &.readonly {
    /deep/ .ql-container {
      &.ql-snow {
        border: none;
      }

      .ql-editor {
        padding: 0;
      }
    }

    .editor {
      min-height: auto;
      max-height: inherit;
    }
  }

  .editor {
    min-height: 60px;
    max-height: 300px;
    overflow: auto;
  }

  .toolbarBox {
    display: flex;
    border: 2px solid #e8e8e8;
    position: relative;
    background: #fff;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    .toolbar {
      flex-grow: 1;
    }

    .buttonBox {
      display: flex;
      flex-shrink: 0;
      margin-right: 8px;

      .button {
        width: 56px;
        height: 32px;
        margin-left: 6px;
        border: 1px solid #dcdfe6;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;

        &:hover {
          opacity: 0.8;
        }

        &.cancel {
          color: #606266;
        }

        &.submit {
          background: #55bb8e;
          border-color: #55bb8e;
          color: #fff;
        }
      }
    }
  }

  /deep/ .ql-container {
    &.ql-snow {
      border: 2px solid #e8e8e8;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      position: relative;
      background: #fff;
      border-bottom: 0;
    }
  }

  /deep/ .ql-toolbar {
    &.ql-snow {
      border: none;
    }
  }
}
</style>
