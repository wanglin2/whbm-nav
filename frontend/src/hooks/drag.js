import { reactive, ref } from "vue";

// 拖拽
export const useDrag = ({ dragEndCallback }) => {
	const drag = ref(false);
	const dragOptions = reactive({
		animation: 200,
		disabled: false,
		ghostClass: "ghost",
	});
	// 拖拽结束
	const onDragEnd = () => {
		drag.value = false;
		dragEndCallback && dragEndCallback();
	};

	return {
		drag,
		dragOptions,
		onDragEnd
	};
};