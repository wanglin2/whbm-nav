<template>
  <el-config-provider :locale="zhCn">
    <div class="todoContainer">
      <div class="inputBox">
        <input
          type="text"
          placeholder="输入文本并按回车添加"
          v-model="inputText"
          @keyup.enter="createTodo"
        />
      </div>
      <div class="handleBox">
        <div class="deleteCompleteListBtn" @click="deleteCompletedTodos">
          清除已完成的待办事项
        </div>
      </div>
      <div class="todoList">
        <transition-group name="list-complete" tag="p">
          <div
            class="todoItem list-complete-item"
            v-for="(item, index) in todoList"
            :ref="
              (el) => {
                if (el) todoItemRefs[index] = el;
              }
            "
            :key="item.id"
            :class="{ complete: item.status === '1' }"
            @click="toggleStatus(item)"
          >
            <div class="row">
              <div class="icon"></div>
              <div
                class="content"
                :contenteditable="item.edit"
                v-if="!item.setRemind"
              >
                {{ item.content }}
              </div>
              <div class="timeSelectBox" v-else>
                <el-date-picker
                  v-model="item.remindTime"
                  type="datetime"
                  placeholder="请选择提醒时间"
                  :disabledDate="disableDate"
                >
                </el-date-picker>
              </div>
              <div class="btn" @click.stop>
                <el-button v-if="item.edit || item.setRemind">
                  <div
                    class="completeEditBtn"
                    @click="completeHandle(item, index)"
                  ></div>
                </el-button>
                <el-dropdown
                  v-else
                  trigger="click"
                  placement="bottom-end"
                  @command="handle($event, item, index)"
                >
                  <el-button>···</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="btnItem in getOptions(item)"
                        :key="btnItem.key"
                        :command="btnItem.key"
                        >{{ btnItem.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="row timeRow" v-if="item.remindTime">
              <div class="timeBox">
                <span class="icon"></span>
                <span class="time">{{ formatTime(item) }}</span>
              </div>
            </div>
          </div>
        </transition-group>
        <div class="loadBtn">我是有底线的</div>
      </div>
      <!--完成音-->
      <audio class="nodisplay">
        <source
          src="http://assets.lxqnsys.com/wl3-complete.m4a"
          type="audio/mpeg"
        />
        <source
          src="http://assets.lxqnsys.com/wl3-complete.ogg"
          type="audio/ogg"
        />
      </audio>
      <!--通知音-->
      <audio class="nodisplay" ref="notifyAudio">
        <source
          src="http://assets.lxqnsys.com/wl3-notification.m4a"
          type="audio/mpeg"
        />
        <source
          src="http://assets.lxqnsys.com/wl3-notification.ogg"
          type="audio/ogg"
        />
      </audio>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, onBeforeUpdate, nextTick, watch, onUnmounted, h, onMounted } from "vue";
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDatePicker,
  ElButton,
  ElConfigProvider,
  ElMessage,
  ElNotification,
} from "element-plus";
import "element-plus/es/components/dropdown/style/css";
import "element-plus/es/components/dropdown-menu/style/css";
import "element-plus/es/components/dropdown-item/style/css";
import "element-plus/es/components/date-picker/style/css";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/notification/style/css";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import axios from "axios";
import dayjs from "dayjs";

const isDev = process.env.NODE_ENV === "development";
axios.defaults.baseURL = `http://lxqnsys.com/d/applets/api/${
  isDev ? "dev" : "v1"
}/todo`;

// 提醒
const useRemind = ({ todoList }) => {
  let timer = null;
  const notifyAudio = ref(null);

  // 提醒
  const remind = (item) => {
    // 铃声提醒
    notifyAudio.value.play();
    // 页面提醒
    ElNotification({
      title: "待办提醒",
      message: h("i", { style: "color: teal" }, item.content),
      duration: 0,
    });
    //桌面提醒
    if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(() => {
        new Notification("任务提醒", { body: item.content });
      });
    }
    item.remined = true;
  };

  // 循环
  const startLoop = (list) => {
    list.forEach((item) => {
      if (
        Date.now() >= item.remindTime &&
        Date.now() <= item.remindTime + 1000 &&
        !item.remined
      ) {
        remind(item);
      }
    });
    timer = setTimeout(() => {
      startLoop(list);
    }, 1000);
  };

  // 检查是否需要提醒
  const checkRemind = () => {
    let list = todoList.value.filter((item) => {
      return (
        item.remindTime && item.status === "0" && item.remindTime > Date.now()
      );
    });
    clearTimeout(timer);
    if (list.length > 0) {
      startLoop(list);
    }
  };

  watch(
    todoList,
    () => {
      checkRemind();
    },
    { deep: true, immediate: true }
  );

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return {
    notifyAudio,
  };
};

// 待办列表
const useTodoList = () => {
  const inputText = ref("");
  const todoList = ref([]);
  const todoItemRefs = ref([]);

  // 确保在每次更新之前重置ref
  onBeforeUpdate(() => {
    todoItemRefs.value = [];
  });

  // 获取待办列表
  const getTodoList = async () => {
    try {
      let { data } = await axios.get("/getTodoList.php");
      if (data.code === 0) {
        todoList.value = (data.data || []).map((item) => {
          return {
            ...item,
            remindTime:
              item.remindTime === "0" || !item.remindTime
                ? null
                : Number(item.remindTime),
          };
        });
      } else {
        todoList.value = [];
      }
    } catch (e) {
      console.log(e);
      todoList.value = [];
      ElMessage.error("获取数据失败");
    }
  };

  getTodoList();

  // 添加
  const createTodo = async () => {
    try {
      let value = inputText.value.trim();
      if (!value) {
        return;
      }
      let formData = new FormData();
      formData.append("content", inputText.value);
      let { data } = await axios.post("/createTodo.php", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (data.code === 0) {
        inputText.value = "";
        todoList.value.unshift({
          id: data.data,
          content: value,
          status: "0",
        });
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("创建失败");
    }
  };

  // 更新待办
  const updateTodo = async (obj) => {
    let formData = new FormData();
    Object.keys(obj).forEach((key) => {
      formData.append(key, obj[key]);
    });
    let { data } = await axios.post("/updateTodo.php", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  };

  // 切换待办状态
  const toggleStatus = async (item) => {
    try {
      if (item.edit || item.setRemind) {
        return;
      }
      let value = item.status === "0" ? "1" : "0";
      let res = await updateTodo({
        id: item.id,
        field: "status",
        value,
      });
      if (res.code === 0) {
        item.status = value;
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("操作失败");
    }
  };

  return {
    inputText,
    todoList,
    todoItemRefs,
    createTodo,
    toggleStatus,
    updateTodo,
    getTodoList,
  };
};

// 按钮
const useBtn = () => {
  const getOptions = (item) => {
    switch (true) {
      case item.status === "0" && !!item.remindTime:
        return [
          {
            label: "修改提醒时间",
            key: "setRemindTime",
          },
          {
            label: "取消提醒时间",
            key: "cancelRemindTime",
          },
          {
            label: "编辑",
            key: "edit",
          },
          {
            label: "删除",
            key: "delete",
          },
        ];
      case item.status === "0":
        return [
          {
            label: "设置提醒时间",
            key: "setRemindTime",
          },
          {
            label: "编辑",
            key: "edit",
          },
          {
            label: "删除",
            key: "delete",
          },
        ];
      case item.status === "1":
        return [
          {
            label: "删除",
            key: "delete",
          },
        ];
      default:
        break;
    }
  };

  return {
    getOptions,
  };
};

// 处理
const useHandle = ({ todoList, todoItemRefs, updateTodo, getTodoList }) => {
  // 删除已完成的
  const deleteCompletedTodos = async (item, index) => {
    try {
      let { data } = await axios.get("/deleteCompletedTodos.php");
      if (data.code === 0) {
        getTodoList();
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("删除失败");
    }
  };

  // 删除
  const deleteTodo = async (item, index) => {
    try {
      let { data } = await axios.get("/deleteTodo.php", {
        params: {
          id: item.id,
        },
      });
      if (data.code === 0) {
        todoList.value.splice(index, 1);
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("删除失败");
    }
  };

  // 编辑
  const editTodo = async (item, index) => {
    item.edit = true;
    nextTick(() => {
      let el = todoItemRefs.value[index].querySelector(".content");
      el.focus();
      let range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  };

  // 重新编辑
  const completeEdit = async (item, index) => {
    try {
      let el = todoItemRefs.value[index].querySelector(".content");
      let value = el.textContent;
      let res = await updateTodo({
        id: item.id,
        field: "content",
        value,
      });
      if (res.code === 0) {
        item.edit = false;
        item.content = value;
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("修改失败");
    }
  };

  // 禁用时间
  const disableDate = (ts) => {
    return ts < dayjs(dayjs().format("YYYY/MM/DD") + "00:00:00").valueOf();
  };

  // 设置提醒时间
  const completeSetRemind = async (item, index, cancel) => {
    try {
      if (!item.remindTime && !cancel) {
        return;
      }
      item.remindTime = dayjs(item.remindTime).valueOf();
      let res = await updateTodo({
        id: item.id,
        field: "remindTime",
        value: cancel ? null : item.remindTime,
      });
      if (res.code === 0) {
        item.setRemind = false;
        if (cancel) {
          item.remindTime = null;
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("设置失败");
    }
  };

  // 完成操作
  const completeHandle = (item, index) => {
    switch (true) {
      case item.setRemind:
        completeSetRemind(item, index);
        break;
      case item.edit:
        completeEdit(item, index);
        break;
      default:
        break;
    }
  };

  // 设置提醒时间
  const seletRemindTime = (item, index) => {
    item.setRemind = true;
  };

  // 取消提醒时间
  const cancelRemindTime = (item, index) => {
    completeSetRemind(item, index, true);
  };

  // 格式化时间
  const formatTime = (item) => {
    let text = "";
    if (item.remined) {
      text = "(已提醒)";
    } else if (Number(item.remindTime) < Date.now()) {
      text = "(已过期)";
    }
    return dayjs(Number(item.remindTime)).format("YYYY/MM/DD HH:mm:ss") + text;
  };

  const handle = (key, item, index) => {
    switch (key) {
      case "delete":
        deleteTodo(item, index);
        break;
      case "edit":
        editTodo(item, index);
        break;
      case "setRemindTime":
        seletRemindTime(item, index);
        break;
      case "cancelRemindTime":
        cancelRemindTime(item, index);
        break;
      default:
        break;
    }
  };

  return {
    handle,
    completeHandle,
    disableDate,
    formatTime,
    deleteCompletedTodos,
  };
};

const {
  inputText,
  todoList,
  todoItemRefs,
  createTodo,
  toggleStatus,
  updateTodo,
  getTodoList,
} = useTodoList();
const { notifyAudio } = useRemind({ todoList });
const {
  handle,
  completeHandle,
  disableDate,
  formatTime,
  deleteCompletedTodos,
} = useHandle({
  todoList,
  todoItemRefs,
  updateTodo,
  getTodoList,
});
const { getOptions } = useBtn();
</script>

<style lang="less">
.list-complete-item {
  transition: all 0.8s ease;
  display: inline-block;
}

.list-complete-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-complete-leave-active {
  position: absolute;
}
</style>
<style lang="less" scoped>
.todoContainer {
  width: 100%;
  height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;

  .nodisplay {
    position: fixed;
    left: -99999px;
    visibility: hidden;
  }

  .inputBox {
    flex-shrink: 0;
    margin-bottom: 10px;

    input {
      width: 100%;
      height: 52px;
      background: rgb(255, 255, 255);
      border: 1px solid rgb(153, 153, 153);
      border-radius: 6px;
      padding: 12px 50px 12px 12px;
      outline: none;
      color: rgb(51, 51, 51);
    }
  }

  .handleBox {
    flex-shrink: 0;
    margin-bottom: 10px;

    .deleteCompleteListBtn {
      color: rgb(51, 51, 51);
      cursor: pointer;
      font-weight: 500;
      font-size: 12px;
      user-select: none;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .todoList {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    position: relative;

    .todoItem {
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-top: 17px;
      padding-bottom: 10px;
      cursor: pointer;
      width: 100%;

      &:hover {
        background: rgb(246, 246, 246);
      }

      &.complete {
        .icon {
          background-image: url("http://assets.lxqnsys.com/%E9%80%89%E6%8B%A9%E6%A1%86-%E5%A4%9A%E9%80%89%E5%B7%B2%E9%80%89.png");
        }

        .content {
          text-decoration: line-through;
        }

        .timeBox {
          .time {
            color: rgb(153, 153, 153);
          }
        }
      }

      .row {
        display: flex;

        &.timeRow {
          justify-content: flex-end;
        }
      }

      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url("http://assets.lxqnsys.com/%E9%80%89%E6%8B%A9%E6%A1%86-%E5%A4%9A%E9%80%89%E6%9C%AA%E9%80%89.png");
        background-size: cover;
        margin-right: 10px;
        margin-top: 3px;
        flex-shrink: 0;
      }

      .content {
        width: 100%;
        font-size: 14px;
        color: rgb(51, 51, 51);
        font-weight: 400;
        transition: all 0.1s ease-in-out 0s;
        line-height: 22px;
        word-break: break-all;
        outline: none;
      }

      .btn {
        flex-shrink: 0;
        margin-left: 12px;
        margin-top: -7px;
        margin-right: 10px;

        .completeEditBtn {
          width: 16px;
          height: 16px;
          background-image: url("http://assets.lxqnsys.com/%E5%AF%B9%E5%8B%BE.png");
          background-size: cover;
        }
      }

      .timeSelectBox {
        width: 100%;
        margin-top: -4px;
      }

      .timeBox {
        display: flex;
        align-items: center;

        .icon {
          background-image: url("http://assets.lxqnsys.com/%E9%97%B9%E9%92%9F.png");
          margin-top: 0px;
        }

        .time {
          color: rgb(234, 71, 71);
          font-size: 12px;
        }
      }
    }

    .loadBtn {
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>