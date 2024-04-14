<template>
  <div class="editMyClassContainer">
    <div class="toolBox"></div>
    <div class="classBox flex">
      <!-- 分类列表 -->
      <div class="classListBox flex-shrink-0">
        <!-- 分类列表 -->
        <div class="classList">
          <div
            class="classItem flex items-center"
            v-for="(item, index) in classList"
            :key="index"
            :class="{ active: activeClassIndex === index }"
            @click="activeClassIndex = index"
          >
            <div class="left">
              <n-input
                v-if="item.isEdit"
                v-model:value="item.name"
                type="text"
                size="small"
                placeholder="请输入分类名称"
              />
              <span v-else class="name">{{ item.name }}</span>
            </div>
            <div class="right flex">
              <!-- 编辑 -->
              <n-button
                circle
                size="tiny"
                type="primary"
                style="margin: 0 5px"
                @click.stop="editAddClass(item, index)"
              >
                <n-icon size="12">
                  <CheckCircleRegular v-if="item.isEdit" />
                  <Edit v-else />
                </n-icon>
              </n-button>
              <!-- 删除 -->
              <n-button
                circle
                size="tiny"
                type="error"
                style="margin: 0 5px"
                @click.stop="deleteClass(item, index)"
              >
                <n-icon size="12">
                  <Trash />
                </n-icon>
              </n-button>
            </div>
          </div>
        </div>
        <!-- 添加分类按钮 -->
        <n-button @click="addClass">
          <template #icon>
            <n-icon>
              <Plus />
            </n-icon>
          </template>
          添加分类
        </n-button>
      </div>
      <!-- 分类标签 -->
      <div
        class="tagBox flex-grow"
        v-if="
          activeClassIndex >= 0 &&
          classList.length > 0 &&
          activeClassIndex < classList.length
        "
      >
        <template v-if="classList[activeClassIndex].id !== ''">
          <!-- 标签列表 -->
          <div class="tagList flex flex-wrap">
            <n-tag
              v-for="(tagItem, tagIndex) in classList[activeClassIndex].tagList"
              :key="tagIndex"
              :type="getRandomTagType(tagIndex)"
              closable
              size="small"
              @close="deleteTag(classList[activeClassIndex], tagItem, tagIndex)"
              style="margin: 5px 5px"
            >
              {{ tagItem.name }}
            </n-tag>
          </div>
          <!-- 添加标签 -->
          <div class="tagBtnBox">
            <!-- 标签输入框 -->
            <n-input-group
              size="small"
              v-if="classList[activeClassIndex].isAddTag"
              style="width: auto"
            >
              <n-input
                v-model:value="classList[activeClassIndex].tagInputValue"
                size="small"
                placeholder="请输入标签名称"
                :style="{ width: '120px' }"
              />
              <n-button
                type="primary"
                ghost
                size="small"
                @click="addTag(classList[activeClassIndex])"
                >添加</n-button
              >
            </n-input-group>
            <!-- 添加标签按钮 -->
            <n-button
              size="tiny"
              v-else
              @click="classList[activeClassIndex].isAddTag = true"
            >
              <template #icon>
                <n-icon>
                  <Plus />
                </n-icon>
              </template>
              添加标签
            </n-button>
          </div>
        </template>
        <div class="tip" v-else>请先保存分类，然后添加标签</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from "vue";
import {
  NButton,
  NIcon,
  NInput,
  NInputGroup,
  useMessage,
  NTag,
} from "naive-ui";
import { Plus, Trash, Edit, CheckCircleRegular } from "@vicons/fa";
import api from "@/api";
import { navClassMap } from "@/config/constants";
import { useStore } from "vuex";

// 初始化
const useInit = () => {
  const message = useMessage();
  const store = useStore();
  const { proxy } = getCurrentInstance();

  return {
    message,
    store,
    proxy,
  };
};

// 用户配置
const useConfig = ({ store }) => {
  // 添加分类到用户配置中
  const addClassToUserConfig = async (id) => {
    store.dispatch("updateUserConfig", {
      classNavList: [...store.state.userConfig.classNavList, id],
    });
  };
  // 从用户分类中删除
  const deleteFromUserConfig = (id) => {
    store.dispatch("updateUserConfig", {
      classNavList: store.state.userConfig.classNavList.filter((item) => {
        return String(item) !== String(id);
      }),
    });
  };

  return {
    addClassToUserConfig,
    deleteFromUserConfig,
  };
};

// 用户分类数据
const useMyClass = ({
  message,
  addClassToUserConfig,
  deleteFromUserConfig,
  proxy,
}) => {
  const activeClassIndex = ref(-1);
  const classList = ref([]);
  // 获取分类数据
  const getClassList = async () => {
    try {
      let { data } = await api.getUserClass();
      if (data.code === 0 && data.data && data.data.length > 0) {
        classList.value = data.data.map((item) => {
          return {
            id: item.id,
            name: item.className,
            isEdit: false,
            tagList: [],
            isAddTag: false,
            tagInputValue: "",
          };
        });
        activeClassIndex.value = 0;
      }
    } catch (e) {
      console.log(e);
    }
  };
  getClassList();
  //  添加分类
  const addClass = () => {
    classList.value.push({
      id: "", // id存在则代表该分类已保存到数据库
      name: "", // 分类名称
      isEdit: true, // 是否处在编辑分类名称的状态
      tagList: [], // 该分类下的标签列表
      isAddTag: false, // 是否正在添加标签中
      tagInputValue: "", // 当前输入的标签名称
    });
  };

  // 编辑/保存分类名称
  const editAddClass = async (item, index) => {
    try {
      if (item.isEdit) {
        let value = item.name.trim();
        // 必填
        if (!value) {
          message.warning("请输入分类名称");
          return;
        }
        // 检查分类名称是否和官方标签重名
        if (navClassMap[value]) {
          message.warning("该分类名称无法使用");
          return;
        }
        // 检查分类名称是否已存在
        let findIndex = classList.value.findIndex((classItem, classIndex) => {
          return classItem.name === value && classIndex !== index;
        });
        if (findIndex !== -1) {
          message.warning("该标签已存在");
          return;
        }
        // 更新
        let isUpdate = item.id !== "";
        let res = null;
        if (isUpdate) {
          res = await api.updateUserClass({
            className: value,
            id: item.id,
          });
        } else {
          // 添加
          res = await api.addUserClass({
            className: value,
          });
        }
        if (res.data.code === 0) {
          if (isUpdate) {
            message.success("修改成功");
            proxy.$eventEmitter.emit("updateUserClassName", {
              classId: item.id,
              className: value
            });
          } else {
            item.id = res.data.data;
            // 更新用户配置
            await addClassToUserConfig(item.id);
            message.success("添加成功");
          }
          item.isEdit = false;
        } else {
          message.error(res.data.msg || "操作失败");
        }
      } else {
        item.isEdit = true;
      }
    } catch (e) {
      message.error("操作失败");
    }
  };
  // 删除分类
  const deleteClass = async (item, index) => {
    try {
      let hasId = item.id !== "";
      let error = null;
      if (hasId) {
        let { data } = await api.deleteUserClass({
          id: item.id,
        });
        if (data.code !== 0) {
          error = data.msg || "删除失败";
        } else {
          await deleteFromUserConfig(item.id);
        }
      }
      if (error) {
        message.error(error);
      } else {
        classList.value.splice(index, 1);
        message.success("删除成功");
      }
    } catch (e) {
      console.log(e);
      message.error("删除失败");
    }
  };

  return {
    activeClassIndex,
    classList,
    addClass,
    editAddClass,
    deleteClass,
  };
};

// 用户标签数据
const useUserTag = ({ message, activeClassIndex, classList }) => {
  // 获取分类下的标签数据
  const getTagList = async () => {
    if (
      activeClassIndex.value < 0 ||
      activeClassIndex.value >= classList.value.length
    ) {
      return;
    }
    let classId = classList.value[activeClassIndex.value].id;
    let { data } = await api.getUserTag({
      classId,
    });
    if (classId !== classList.value[activeClassIndex.value].id) {
      return;
    }
    if (data.code === 0 && data.data && data.data.length > 0) {
      classList.value[activeClassIndex.value].tagList = data.data.map(
        (item) => {
          return {
            id: item.id,
            name: item.tagName,
          };
        }
      );
    }
  };
  watch(activeClassIndex, () => {
    getTagList();
  });
  // 添加标签
  const addTag = async (item) => {
    let value = item.tagInputValue.trim();
    if (!value) {
      message.warning("请输入标签名称");
      return;
    }
    let findIndex = item.tagList.findIndex((tagItem) => {
      return tagItem.name === value;
    });
    if (findIndex !== -1) {
      message.warning("该标签已存在");
      return;
    }
    let { data } = await api.addUserTag({
      classId: item.id,
      tagName: value,
    });
    if (data.code === 0) {
      item.isAddTag = false;
      item.tagInputValue = "";
      item.tagList.push({
        id: data.data, // id存在则代表已保存到数据库
        name: value, // 标签名
      });
      message.success("添加成功");
    } else {
      message.error(data.msg || "添加失败");
    }
  };
  // 删除标签
  const deleteTag = async (item, tagItem, tagIndex) => {
    try {
      let hasId = tagItem.id !== "";
      let error = null;
      if (hasId) {
        let { data } = await api.deleteUserTag({
          id: tagItem.id
        });
        if (data.code !== 0) {
          error = data.msg || "删除失败";
        }
      }
      if (error) {
        message.error(error);
      } else {
        item.tagList.splice(tagIndex, 1);
        message.success("删除成功");
      }
    } catch (e) {
      console.log(e);
      message.error("删除失败");
    }
  };
  // 随机标签类型
  const getRandomTagType = (index) => {
    let list = ["success", "warning", "error", "info", "default", "primary"];
    return list[index % list.length];
  };

  return {
    addTag,
    deleteTag,
    getRandomTagType,
  };
};

const { message, store, proxy } = useInit();
const { addClassToUserConfig, deleteFromUserConfig } = useConfig({ store });
const { activeClassIndex, classList, addClass, editAddClass, deleteClass } =
  useMyClass({ message, addClassToUserConfig, deleteFromUserConfig, proxy });
const { addTag, deleteTag, getRandomTagType } = useUserTag({
  message,
  activeClassIndex,
  classList,
});
</script>

<style lang="less" scoped>
.editMyClassContainer {
  .toolBox {
  }

  .classBox {
    .classListBox {
      width: 191px;
      border-right: 1px solid var(--other-site-block-hover-color);

      .classList {
        margin-bottom: 10px;

        .classItem {
          height: 50px;
          cursor: pointer;

          &.active {
            background-color: var(--other-site-block-hover-color);
          }

          .left {
            padding-left: 5px;
            width: 126px;
            overflow: hidden;

            .name {
              display: block;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .right {
            width: 64px;
          }
        }
      }
    }

    .tagBox {
      padding: 0 10px;

      .tagList {
        margin-bottom: 10px;
      }

      .tip {
        color: var(--weak-dark-color);
      }
    }
  }
}
</style>
