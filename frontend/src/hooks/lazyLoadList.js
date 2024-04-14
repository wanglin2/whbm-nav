import { ref, computed } from 'vue';
import _ from "lodash";

export const useLazyLoadList = ({ api, plusParams = () => { return {}; } } = {}) => {
  const scrollEl = ref(null);
  const isLoading = ref(false);
  const list = ref([]);
  const pageNo = ref(1);
  const pageSize = ref(20);
  const totalPage = ref(1);
  const getList = async () => {
    try {
      isLoading.value = true;
      let params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        ...plusParams()
      };
      let { data } = await api(params);
      if (data && data.code === 0) {
        totalPage.value = data.data.totalPage;
        list.value.push(...data.data.list);
      }
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  };
  const reload = () => {
    pageNo.value = 1;
    totalPage.value = 1;
    list.value = [];
    isLoading.value = false;
    getList();
  };
  const checkBottom = () => {
    if (isLoading.value || pageNo.value >= totalPage.value) {
      return;
    }
    let { height } = scrollEl.value.getBoundingClientRect();
    let st = scrollEl.value.scrollTop;
    let sh = scrollEl.value.scrollHeight;
    if (st + height >= sh - 50) {
      pageNo.value++;
      getList();
    }
  };
  const checkBottomFn = _.debounce(checkBottom, 300);
  const tip = computed(() => {
    if (isLoading.value) {
      return "正在加载中...";
    }
    if (pageNo.value >= totalPage.value) {
      return "加载完毕";
    }
    return "";
  });

  return {
    list,
    getList,
    scrollEl,
    checkBottomFn,
    tip,
    reload,
  };
};