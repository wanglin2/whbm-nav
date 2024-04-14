<template>
  <div class="loader loader-3 absolute rounded-1\/2 inline-block">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.loader {
  left: 50%;
  top: 50%;
	transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  vertical-align: middle;

  &.loader-3 {
    .dot {
      width: 10px;
      height: 10px;
      background: var(--theme-color);
      border-radius: 50%;
      position: absolute;
      top: calc(50% - 5px);
    }

    .dot1 {
      left: 0px;
      -webkit-animation: dot-jump 0.5s cubic-bezier(0.77, 0.47, 0.64, 0.28)
        alternate infinite;
      animation: dot-jump 0.5s cubic-bezier(0.77, 0.47, 0.64, 0.28) alternate
        infinite;
    }

    .dot2 {
      left: 20px;
      -webkit-animation: dot-jump 0.5s 0.2s cubic-bezier(0.77, 0.47, 0.64, 0.28)
        alternate infinite;
      animation: dot-jump 0.5s 0.2s cubic-bezier(0.77, 0.47, 0.64, 0.28)
        alternate infinite;
    }

    .dot3 {
      left: 40px;
      -webkit-animation: dot-jump 0.5s 0.4s cubic-bezier(0.77, 0.47, 0.64, 0.28)
        alternate infinite;
      animation: dot-jump 0.5s 0.4s cubic-bezier(0.77, 0.47, 0.64, 0.28)
        alternate infinite;
    }
  }
}

@-webkit-keyframes dot-jump {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-15px);
    transform: translateY(-15px);
  }
}

@keyframes dot-jump {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-15px);
    transform: translateY(-15px);
  }
}
</style>