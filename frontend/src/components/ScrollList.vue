<template>
  <div class="scrollListContainer">
    <div class="btn prevBtn" :class="{ active: canPrev }" @click.stop="prev">
      <span class="iconfont icon-jiantou_yemian_xiangzuo" v-if="showBtn"></span>
    </div>
    <div class="listWrap" ref="listWrap">
      <div
        class="scrollList"
        ref="scrollList"
        :style="{ transform: `translateX(${left}px)`, transition: tran }"
        @mousedown="onMousedown"
      >
        <slot></slot>
      </div>
    </div>
    <div class="btn rightBtn" :class="{ active: canNext }" @click.stop="next">
      <span class="iconfont icon-jiantou_yemian_xiangyou" v-if="showBtn"></span>
    </div>
  </div>
</template>

<script>
// 滚动列表
export default {
  name: "ScrollList",
  props: {},
  data() {
    return {
      showBtn: false,
      canPrev: false,
      canNext: false,
      wrapWidth: 0,
      listWidth: 0,
      step: 100,
      left: 0,
      isMousedown: false,
      mousedownX: 0,
      cacheLeft: 0,
      tran: "all 0.3s linear",
    };
  },
  mounted() {
    window.addEventListener("mouseup", this.onMouseup);
    window.addEventListener("mousemove", this.onMousemove);
    this.init();
  },
  beforeUnmount() {
    window.removeEventListener("mouseup", this.onMouseup);
    window.removeEventListener("mousemove", this.onMousemove);
  },
  methods: {
    /**
     * @Author: 王林
     * @Date: 2021-02-15 11:36:29
     * @Desc: 初始化
     */
    init() {
      let listRect = this.$refs.scrollList.getBoundingClientRect();
      let wrapRect = this.$refs.listWrap.getBoundingClientRect();
      if (listRect.width <= wrapRect.width) {
        return;
      }
      this.wrapWidth = wrapRect.width;
      this.listWidth = listRect.width;
      this.canNext = true;
      this.showBtn = true;
    },

    /**
     * @Author: 王林
     * @Date: 2021-02-15 14:00:29
     * @Desc: 左滚
     */
    prev() {
      this.canNext = true;
      if (this.left + this.step < 0) {
        this.left += this.step;
      } else {
        this.canPrev = false;
        this.left = 0;
      }
    },

    /**
     * @Author: 王林
     * @Date: 2021-02-15 14:00:38
     * @Desc: 右滚
     */
    next() {
      this.canPrev = true;
      if (this.left - this.step > -(this.listWidth - this.wrapWidth)) {
        this.left -= this.step;
      } else {
        this.canNext = false;
        this.left = -(this.listWidth - this.wrapWidth);
      }
    },

    /**
     * @Author: 王林
     * @Date: 2021-02-15 14:21:52
     * @Desc: 鼠标按下事件
     */
    onMousedown(e) {
      this.tran = "none";
      this.isMousedown = true;
      this.mousedownX = e.clientX;
      this.cacheLeft = this.left;
    },

    /**
     * @Author: 王林
     * @Date: 2021-02-15 14:23:48
     * @Desc: 鼠标移动事件
     */
    onMousemove(e) {
      if (!this.isMousedown) {
        return;
      }
      let newLeft = this.cacheLeft + e.clientX - this.mousedownX;
      if (newLeft >= 0) {
        this.canPrev = false;
        this.left = 0;
      } else if (newLeft <= -(this.listWidth - this.wrapWidth)) {
        this.canNext = false;
        this.left = -(this.listWidth - this.wrapWidth);
      } else {
        this.canPrev = true;
        this.canNext = true;
        this.left = newLeft;
      }
    },

    /**
     * @Author: 王林
     * @Date: 2021-02-15 14:23:12
     * @Desc: 鼠标松开事件
     */
    onMouseup() {
      this.isMousedown = false;
      this.tran = "all 0.3s linear";
    },
  },
};
</script>

<style lang="less" scoped>
.scrollListContainer {
  width: 100%;
  display: flex;

  .btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: 20px;
    line-height: 40px;
    text-align: center;
    cursor: not-allowed;
    opacity: 0.3;

    &.active {
      opacity: 1;
      cursor: pointer;
    }
  }

  .listWrap {
    width: 100%;
    overflow: hidden;

    .scrollList {
      width: max-content;
      cursor: pointer;
    }
  }
}
</style>
