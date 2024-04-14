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
import ImgUpload from '../../ImgUpload.vue';

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
  const imgUploadComp = ref(null);
  const columns = ref([
    {
      type: "selection",
    },
    {
      title: "名称",
      key: "sitename",
      width: 150,
      ellipsis: {
        tooltip: true,
      },
      render(row) {
        if (row.edit) {
          return h(NInput, {
            type: "text",
            value: row.sitename,
            onInput: (e) => {
              row.sitename = e;
            },
          });
        } else {
          return row.sitename;
        }
      },
    },
    {
      title: "网址",
      key: "siteurl",
      ellipsis: {
        tooltip: true,
      },
      render(row) {
        if (row.edit) {
          return h(NInput, {
            type: "text",
            value: row.siteurl,
            onInput: (e) => {
              row.siteurl = e;
            },
          });
        } else {
          return row.siteurl;
        }
      },
    },
    {
      title: "图标",
      key: "siteicon",
      ellipsis: {
        tooltip: true,
      },
      width: 70,
      render(row) {
        return row.siteicon ? h('img', {
          src: row.siteicon,
          className: 'tableSiteIcon'
        }) : null;
      },
    },
    {
      title: "操作",
      key: "",
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
  getTableListUrl: "getMySiteList",
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
  deleteUrl: "deleteUserSite",
  deleteCallback: () => {
    proxy.$eventEmitter.emit("refreshMySite");
    getTableList();
  },
  updateSiteUrl: "updateUserSite",
  siteNameProp: "sitename",
  siteUrlProp: "siteurl",
  editCallback: () => {
    proxy.$eventEmitter.emit("refreshMySite");
    getTableList();
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

.tableImgUploadContainer {
  width: 46px;
  height: 100px;
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
