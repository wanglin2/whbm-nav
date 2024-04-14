import { ref, reactive } from 'vue';
import { isValidUrl } from "@/utils";

// 添加网站输入
export const useInput = () => {
	const formRef = ref(null);
	const model = reactive({
		name: "",
		url: "",
		desc: ""
	});
	const reset = () => {
		model.name = "";
		model.url = "";
		model.desc = "";
	};
	const rules = reactive({
		name: [
			{
				required: true,
				message: "请输入网站名称",
				trigger: ["input", "blur"],
			},
		],
		url: [
			{
				required: true,
				validator(rule, value) {
					value = value.trim();
					if (!value) {
						return new Error("请输入网站地址");
					}
					if (!isValidUrl(value)) {
						return new Error("格式不正确");
					}
					return true;
				},
				trigger: ["input", "blur"],
			},
		],
	});

	return {
		formRef,
		model,
		rules,
		reset,
	};
};