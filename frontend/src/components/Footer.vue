<template>
  <div class="footerContainer">
    <div class="row flex">
      <div class="name font-bold">友情链接</div>
      <div class="value">
        <ul class="linkList flex flex-wrap">
          <li class="linkItem" v-for="item in friendLinkList" :key="item.id">
            <a :href="item.siteurl">{{ item.sitename }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row flex">
      <div class="name font-bold">版权信息</div>
      <div class="value">
        © <a href="../">理想青年实验室</a> 2015-{{ currentYear }} 赣ICP备16009458号-3
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api";
import { ref } from "vue";

// 友情链接
const useFriendLinks = () => {
  const friendLinkList = ref([]);
  const getFriendLinks = async () => {
    try {
      let { data } = await api.getFriendLinks();
      friendLinkList.value = data.data || [];
    } catch (e) {
      console.log(e);
    }
  };
  getFriendLinks();

  return {
    friendLinkList,
  };
};

// 版权信息
const useCopyright = () => {
  const currentYear = new Date().getFullYear();

  return {
    currentYear,
  };
};

const { friendLinkList } = useFriendLinks();
const { currentYear } = useCopyright();
</script>

<style lang="less" scoped>
.footerContainer {
  margin-top: 20px;

  .row {
    margin-bottom: 10px;

    .name {
      color: var(--dark-color);
      min-width: 100px;
      line-height: 2em;
    }

    .value {
      color: var(--dark-color);

      .linkList {
        line-height: 2em;

        .linkItem {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
