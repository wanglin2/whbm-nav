import { ref } from 'vue';
import api from '@/api';

// 分类标签数据
export const useUserClassTag = () => {
    const userClassList = ref([]);
    const classListMap = ref({});
    const getUserClassTagList = async () => {
        try {
            let { data } = await api.getUserClassTagList();
            if (data && data.code === 0) {
                userClassList.value = data.data.class || []
                ;(data.data.class || []).forEach((item) => {
                    classListMap.value[item.id] = {
                        name: item.className,
                        id: item.id,
                        icon: null,
                        tag: item.className,
                    };
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        userClassList,
        classListMap,
        getUserClassTagList,
    };
};