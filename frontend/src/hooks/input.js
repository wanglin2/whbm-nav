import { ref } from 'vue';

// 输入
export const useInput = (enterCallback = () => { }) => {
    const inputText = ref("");

    // 输入事件
    const onInput = async (e) => {
        inputText.value = e.target.value.trim();
    };

    // 按键事件
    const onEnter = (e) => {
        if (e.keyCode === 13) {
            enterCallback();
        }
    };

    return {
        inputText,
        onInput,
        onEnter
    };
};