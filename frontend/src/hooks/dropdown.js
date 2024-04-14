import { ref } from 'vue';

// 下拉菜单
const dropdownList = ref([])
export const useDropDownMenu = () => {
	const showDropdown = ref(false);
	dropdownList.value.push(showDropdown)

	// 切换显示隐藏
	const toggleDropdown = (value) => {
		showDropdown.value = value !== undefined ? value : !showDropdown.value;
		hideAllList(showDropdown);
	};

	// 隐藏所有下拉菜单
	const hideAllList = (extra) => {
		dropdownList.value
			.filter((item) => {
				return item !== extra;
			})
			.forEach((item) => {
				item.value = false;
			});
	};

	document.body.addEventListener("click", hideAllList);

	// 解绑
	const distory = () => {
		document.body.removeEventListener("click", hideAllList);
	};

	return {
		showDropdown,
		toggleDropdown,
		distory
	};
};

// 鼠标移上显示
export const useMouseoverDropMenu = () => {
	const showMouseoverDropMenu = ref(false);
	const onMouseenter = () => {
		showMouseoverDropMenu.value = true
	}
	const onMouseleave = () => {
		showMouseoverDropMenu.value = false;
	};

	return {
		showMouseoverDropMenu,
		onMouseenter,
		onMouseleave
	};
}