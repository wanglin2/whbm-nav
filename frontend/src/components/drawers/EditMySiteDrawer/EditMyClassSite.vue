<template>
  <div>
    <div class="btnRow">
      <n-button type="error" size="small" :disabled="selectedTableRow.length <= 0" @click="multiDeleteTableRow">
        <template #icon>
          <n-icon>
            <Trash />
          </n-icon>
        </template>
        删除
      </n-button>
      <span class="tip">{{
          selectedTableRow.length > 0
            ? "已选择" + selectedTableRow.length + "个"
            : "tips.可跨页多选"
      }}</span>
    </div>
    <n-data-table remote ref="table" :columns="columns" :data="tableList" :loading="loading" :pagination="pagination"
      :row-key="rowKey" @update:checked-row-keys="handleCheck" />
  </div>
</template>

<script setup>
import { NDataTable, NButton, NIcon, NInput } from "naive-ui";
import { ref, h, getCurrentInstance } from "vue";
import { Trash } from "@vicons/fa";
import { useTableHandle, useTable, createSiteTableBtnCol } from "@/hooks/table";

// 初始化
const useInit = () => {
  const { proxy } = getCurrentInstance();

  return {
    proxy,
  };
};

// 表格列
const useTableColumns = ({
  deleteTableRow,
  editTableRow,
  completeEditSite,
  openUrl,
}) => {
  const columns = ref([
    {
      type: "selection",
    },
    {
      title: "名称",
      key: "siteName",
      ellipsis: {
        tooltip: true,
      },
      render(row) {
        if (row.edit) {
          return h(NInput, {
            type: "text",
            value: row.siteName,
            onInput: (e) => {
              row.siteName = e;
            },
          });
        } else {
          return row.siteName;
        }
      },
    },
    {
      title: "网址",
      key: "siteUrl",
      ellipsis: {
        tooltip: true,
      },
      render(row) {
        if (row.edit) {
          return h(NInput, {
            type: "text",
            value: row.siteUrl,
            onInput: (e) => {
              row.siteUrl = e;
            },
          });
        } else {
          return row.siteUrl;
        }
      },
    },
    {
      title: "分类",
      key: "className",
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: "标签",
      key: "tagName",
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: "图标",
      key: "siteIcon",
      width: 70,
      render(row) {
        return row.siteIcon ? h('img', {
          src: row.siteIcon,
          className: 'tableSiteIcon'
        }) : null;
      },
    },
    {
      title: "操作",
      key: "",
      width: 120,
      render(row) {
        return createSiteTableBtnCol({
          deleteTableRow,
          row,
          completeEditSite,
          editTableRow,
          openUrl,
        });
      },
    },
  ]);

  return {
    columns,
  };
};

const { proxy } = useInit();
const { tableList, loading, pagination, rowKey, getTableList } = useTable({
  getTableListUrl: "getUserClassSiteList"
});
const {
  handleCheck,
  selectedTableRow,
  deleteTableRow,
  multiDeleteTableRow,
  editTableRow,
  openUrl,
  completeEditSite,
} = useTableHandle({
  deleteUrl: "deleteUserClassSite",
  deleteCallback: (row) => {
    getTableList();
    if (Array.isArray(row)) {
      let classIdArr = row.map((id) => {
        let classId = ''
        tableList.value.forEach((item) => {
          if (String(item.id) === String(id)) {
            classId = item.classId
          }
        })
        return classId;
      })
      proxy.$eventEmitter.emit("refreshUserClassSite", { classId: classIdArr });
    } else if (row) {
      proxy.$eventEmitter.emit("refreshUserClassSite", { classId: row.classId });
    }
  },
  updateSiteUrl: 'updateUserClassSite',
  siteNameProp: 'siteName',
  siteUrlProp: "siteUrl",
  editCallback: (row) => {
    getTableList();
    proxy.$eventEmitter.emit("refreshUserClassSite", { classId: row.classId });
  },
});
const { columns } = useTableColumns({
  deleteTableRow,
  editTableRow,
  completeEditSite,
  openUrl,
});
</script>

<style lang="less">
.tableSiteIcon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
<style lang="less" scoped>
.btnRow {
  margin-bottom: 10px;

  .tip {
    margin-left: 5px;
    color: var(--weak-dark-color);
  }
}
</style>
