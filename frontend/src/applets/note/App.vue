<template>
  <el-config-provider :zIndex="5000">
    <div class="noteContainer">
      <div class="editorBox">
        <Editor ref="editor" @submit="onSubmit"></Editor>
      </div>
      <div class="listBox" @scroll="onScroll">
        <div class="noteItem" v-for="item in noteList" :key="item.id">
          <div class="noteItemHeader" v-if="!item.edit">
            <div class="time">{{ item.createAt }}</div>
            <div class="menu">
              <el-dropdown @command="handleCommand($event, item)">
                <el-button
                  type="text"
                  size="small"
                  style="color: #7d7d7d; font-size: 12px"
                  >•••</el-button
                >
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="noteItemContent">
            <Editor
              :readonly="!item.edit"
              :edit="item.edit"
              :content="item.content"
              @submit="onSubmit($event, item)"
              @cancel="onCancel(item)"
            ></Editor>
          </div>
        </div>
        <div class="tip">{{ loadEnd ? "已加载完毕" : "" }}</div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import Editor from "./Editor";
import { computed, nextTick, ref } from "vue";
import axios from "axios";
import {
  ElMessage,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
  ElConfigProvider,
} from "element-plus";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/dropdown/style/css";
import "element-plus/es/components/dropdown-menu/style/css";
import "element-plus/es/components/dropdown-item/style/css";
import "element-plus/es/components/button/style/css";

const isDev = process.env.NODE_ENV === "development";
axios.defaults.baseURL = `http://lxqnsys.com/d/applets/api/${
  isDev ? "dev" : "v1"
}/note`;

// 操作
const editor = ref(null);
const useHandle = ({ refreshNoteList, noteList }) => {
  // 创建笔记
  const createNote = async (content) => {
    try {
      let formData = new FormData();
      formData.append("content", content);
      let { data } = await axios.post("/createNote.php", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (data.code === 0) {
        ElMessage.success("发送成功");
        editor.value.clear();
        refreshNoteList();
      } else {
        ElMessage.error("发送失败");
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("发送失败");
    }
  };

  // 更新笔记
  const updateNote = async (content, item) => {
    try {
      let formData = new FormData();
      formData.append("id", item.id);
      formData.append("content", content);
      let { data } = await axios.post("/updateNote.php", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (data.code === 0) {
        ElMessage.success("发送成功");
        item.edit = false;
      } else {
        ElMessage.error("发送失败");
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("发送失败");
    }
  };

  // 删除笔记
  const deleteNote = async (item, index) => {
    try {
      let { data } = await axios.get("/deleteNote.php", {
        params: {
          id: item.id,
        },
      });
      if (data.code === 0) {
        ElMessage.success("删除成功");
        noteList.value.splice(index, 1);
      } else {
        ElMessage.error("删除失败");
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("删除失败");
    }
  };

  // 处理
  const handleCommand = (command, item, index) => {
    switch (command) {
      case "edit":
        item.edit = true;
        break;
      case "delete":
        deleteNote(item, index);
        break;
      default:
        break;
    }
  };

  // 发送
  const onSubmit = (content, item) => {
    if (content.ops.length === 1 && content.ops[0].insert === "\n") {
      return;
    }
    content = JSON.stringify(content);
    if (item) {
      updateNote(content, item);
    } else {
      createNote(content);
    }
  };

  // 取消
  const onCancel = (item) => {
    item.edit = false;
    let cache = item.content;
    item.content = "";
    nextTick(() => {
      item.content = cache;
    });
  };

  return {
    onSubmit,
    handleCommand,
    onCancel,
  };
};

// 笔记列表
const useNoteList = () => {
  const noteList = ref([]);
  const pageNo = ref(1);
  const pageSize = ref(5);
  const totalPage = ref(1);
  const loadEnd = computed(() => {
    return pageNo.value >= totalPage.value;
  });
  const loading = ref(false);

  // 获取笔记列表
  const getNoteList = async () => {
    try {
      let params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
      };
      let { data } = await axios.get("/getNoteList.php", {
        params,
      });
      console.log(data);
      if (data.code === 0) {
        totalPage.value = data.data.totalPage;
        noteList.value.push(...data.data.list);
      } else {
        ElMessage.error("请求失败");
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("请求失败");
    }
  };
  getNoteList();

  // 刷新编辑列表
  const refreshNoteList = () => {
    noteList.value = [];
    pageNo.value = 1;
    totalPage.value = 1;
    getNoteList();
  };

  // 监听滚动
  const onScroll = async (e) => {
    if (loadEnd.value || loading.value) {
      return;
    }
    let tar = e.target;
    if (tar.scrollTop + tar.clientHeight >= tar.scrollHeight - 50) {
      console.log("加载下一页");
      loading.value = true;
      pageNo.value++;
      await getNoteList();
      loading.value = false;
    }
  };

  return {
    noteList,
    getNoteList,
    refreshNoteList,
    onScroll,
    loadEnd,
  };
};

const { noteList, refreshNoteList, onScroll, loadEnd } = useNoteList();
const { onSubmit, handleCommand, onCancel } = useHandle({
  refreshNoteList,
  noteList,
});
</script>

<style lang="less" scoped>
.noteContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  .editorBox {
    flex-shrink: 0;
    padding: 10px;
  }

  .listBox {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;

    .noteItem {
      margin: 5px 0 5px;
      margin-bottom: 10px;
      position: relative;
      background: #ffffff;
      border-radius: 6px;
      padding: 15px;

      &:hover {
        box-shadow: 0px 2px 16px #dddddd;
      }

      .noteItemHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .time {
          font-size: 12px;
          color: #8f9193;
        }

        .menu {
        }
      }

      .noteItemContent {
      }
    }
  }

  .tip {
    text-align: center;
    font-size: 12px;
    color: #8f9193;
    line-height: 50px;
  }
}
</style>