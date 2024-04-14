import { useMessage, NButton, NIcon } from "naive-ui";
import { reactive, ref, h } from "vue";
import { Trash, Edit, LocationArrow, CheckCircleRegular } from "@vicons/fa";
import api from "@/api";
import { isValidUrl } from "@/utils";

// 表格操作
export const useTableHandle = ({ deleteUrl, deleteCallback, siteUrlProp, siteNameProp, editCallback, updateSiteUrl }) => {
	const message = useMessage();

	// 多选
	const selectedTableRow = ref([]);
	const handleCheck = (rowKeys) => {
		selectedTableRow.value = rowKeys;
	};

	// 删除行
	const _deleteTableRow = async (ids, deleteData) => {
		try {
			let { data } = await api[deleteUrl]({
				ids,
			});
			if (data && data.code === 0) {
				message.success("删除成功");
				if (deleteCallback) deleteCallback(deleteData)
			} else {
				message.error(data && data.msg ? data.msg : "删除失败");
			}
		} catch (e) {
			console.log(e);
			message.error("删除失败");
		}
	};
	// 单行删除
	const deleteTableRow = (row) => {
		_deleteTableRow(row.id, row);
	};
	// 多行删除
	const multiDeleteTableRow = () => {
		_deleteTableRow(selectedTableRow.value.join(","), selectedTableRow.value);
	};

	// 确认编辑网站
	const completeEditSite = async (row) => {
		try {
			if (!row[siteNameProp].trim()) {
				message.warning("请输入网站名称");
				return;
			}
			if (!isValidUrl(row[siteUrlProp])) {
				message.warning("请输入正确的网站地址");
				return;
			}
			let { data } = await api[updateSiteUrl]({
				id: row.id,
				[siteNameProp]: row[siteNameProp].trim(),
				[siteUrlProp]: row[siteUrlProp],
			});
			if (data && data.code === 0) {
				message.success("修改成功");
				if (editCallback) editCallback(row)
			} else {
				message.error(data && data.msg ? data.msg : "修改失败");
			}
		} catch (e) {
			console.log(e);
			message.error("修改失败");
		}
	};
	// 开启编辑
	const editTableRow = (row) => {
		row.edit = true;
	};

	// 直达网站
	const openUrl = (row) => {
		let a = document.createElement("a");
		a.href = row[siteUrlProp];
		a.target = "_blank";
		a.click();
	};

	return {
		handleCheck,
		selectedTableRow,
		completeEditSite,
		deleteTableRow,
		multiDeleteTableRow,
		editTableRow,
		openUrl,
	};
};

// 使用表格
export const useTable = ({ getTableListUrl, pageSize = 10 }) => {
	const tableList = ref([]);
	const loading = ref(false);
	// 分页信息
	const pagination = reactive({
		page: 1,
		pageCount: 1,
		pageSize,
		showSizePicker: true,
		pageSizes: [10, 20, 50],
		onChange: (page) => {
			pagination.page = page;
			getTableList();
		},
		onPageSizeChange: (pageSize) => {
			pagination.pageSize = pageSize;
			pagination.page = 1;
			getTableList();
		},
		prefix({ itemCount }) {
			return `总数量 ${itemCount || ""}.`;
		},
	});
	// 请求数据
	const getTableList = async () => {
		try {
			loading.value = true;
			let params = {
				pageNo: pagination.page,
				pageSize: pagination.pageSize,
			};
			let { data } = await api[getTableListUrl](params);
			tableList.value = data.data.list.map((item) => {
				return {
					...item,
					edit: false,
				};
			});
			pagination.pageCount = data.data.totalPage;
			pagination.itemCount = data.data.totalNum;
			loading.value = false;
		} catch (e) {
			console.log(e);
			loading.value = false;
		}
	};
	getTableList();
	const rowKey = (rowData) => {
		return rowData.id;
	};

	return {
		tableList,
		loading,
		pagination,
		rowKey,
		getTableList
	};
};

// 网站类表格操作栏
export const createSiteTableBtnCol = ({ deleteTableRow, row, completeEditSite, editTableRow, openUrl }) => {
	return [
		[deleteTableRow, Trash, { type: "error", disabled: row.edit }],
		[
			...(row.edit
				? [completeEditSite, CheckCircleRegular]
				: [editTableRow, Edit]),
			{ type: "primary" },
		],
		[openUrl, LocationArrow, { type: "info", disabled: row.edit }],
	].map((item) => {
		return h(
			NButton,
			{
				size: "tiny",
				circle: true,
				style: {
					margin: "0 5px",
				},
				...item[2],
				onClick: () => {
					item[0](row);
				},
			},
			{
				default: () => {
					return [
						h(
							NIcon,
							{
								size: 12,
							},
							{
								default: () => {
									return h(item[1]);
								},
							}
						),
					];
				},
			}
		);
	});
}