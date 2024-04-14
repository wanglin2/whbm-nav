<template>
    <div class="navList flex flex-wrap bottom-0">
        <div class="navItem flex justify-center items-center cursor-pointer" v-for="(item, index) in navList" :key="index"
            @click="moveToNav(item, index)">
            <span v-if="/^icon/.test(item)" class="iconfont" :class="[item]"></span>
            <span v-else class="name">{{ item }}</span>
        </div>
    </div>
</template>

<script setup>
import { getOffsetValue, scrollTo } from "@/utils";
import { onMounted, ref } from 'vue';

// 导航
const navList = ref([]);
let elList = [];
const init = () => {
    navList.value = [];
    elList = [];
    let els = document.querySelectorAll(".moduleItemContainer");
    for (let i = 0; i < els.length; i++) {
        let titleEl = els[i].querySelector(".title");
        if (titleEl) {
            let iconEl = titleEl.querySelector(".iconBox");
            if (iconEl) {
                navList.value.push(iconEl.getAttribute("data-icon"));
            } else {
                navList.value.push(titleEl.querySelector(".name").textContent[0]);
            }
            elList.push(els[i]);
        }
    }
};

const moveToNav = (item, index) => {
    let { offsetTop } = getOffsetValue(elList[index]);
    scrollTo(offsetTop);
};

onMounted(() => {
    init()
})
</script>

<style lang="less">
.navList {
    width: 62px;
    background-color: var(--other-light-color);
    border: 1px solid var(--other-dark-color);
    border-radius: 5px;
    overflow: hidden;

    .navItem {
        width: 30px;

        &:hover {
            background-color: var(--other-site-block-hover-color);
        }
    }
}
</style>