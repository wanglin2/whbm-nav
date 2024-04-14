<template>
  <div class="tomatotimerContainer">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
    <div class="outerRing">
      <div class="timer">
        <div id="time">
          <span id="minutes">00</span>
          <span id="colon">:</span>
          <span id="seconds">10</span>
        </div>
        <div id="stsp">START</div>
        <span id="setting"><i class="fas fa-cog"></i></span>
      </div>
    </div>
    <!--通知音-->
    <audio class="nodisplay" ref="notifyAudio">
      <source
        src="http://assets.lxqnsys.com/wl3-notification.m4a"
        type="audio/mpeg"
      />
      <source
        src="http://assets.lxqnsys.com/wl3-notification.ogg"
        type="audio/ogg"
      />
    </audio>
  </div>
</template>

<script setup>
import { onMounted, ref, h } from "vue";
import { ElNotification } from "element-plus";
import "element-plus/es/components/notification/style/css";

// 提醒
const useRemind = () => {
  const notifyAudio = ref(null);

  // 提醒
  const remind = () => {
    // 铃声提醒
    notifyAudio.value.play();
    // 页面提醒
    ElNotification({
      title: "番茄计时器提醒",
      message: h("i", { style: "color: teal" }, "倒计时结束"),
      duration: 0,
    });
    //桌面提醒
    if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(() => {
        new Notification("番茄计时器提醒", { body: "倒计时结束" });
      });
    }
  };

  return {
    notifyAudio,
    remind,
  };
};

const init = () => {
  const progressBar = document.querySelector(".outerRing"),
    minElem = document.querySelector("#minutes"),
    secElem = document.querySelector("#seconds"),
    startStop = document.querySelector("#stsp"),
    setting = document.querySelector("#setting");

  let minutes = document.querySelector("#minutes").innerHTML,
    seconds = document.querySelector("#seconds").innerHTML,
    progress = null,
    progressStart = 0,
    progressEnd = parseInt(minutes) * 60 + parseInt(seconds),
    speed = 1000,
    degTravel = 360 / progressEnd,
    toggleSettings = false,
    secRem = 0,
    minRem = 0;

  function progressTrack() {
    progressStart++;

    secRem = Math.floor((progressEnd - progressStart) % 60);
    minRem = Math.floor((progressEnd - progressStart) / 60);

    secElem.innerHTML = secRem.toString().length == 2 ? secRem : `0${secRem}`;
    minElem.innerHTML = minRem.toString().length == 2 ? minRem : `0${minRem}`;

    progressBar.style.background = `conic-gradient(
      	#9d0000 ${progressStart * degTravel}deg,
      	#17171a ${progressStart * degTravel}deg
  		)`;
    if (progressStart == progressEnd) {
      remind();
      progressBar.style.background = `conic-gradient(
				#00aa51 360deg,
				#00aa51 360deg
		  )`;
      clearInterval(progress);
      startStop.innerHTML = "START";
      progress = null;
      progressStart = 0;
    }
  }

  function startStopProgress() {
    if (!progress) {
      progress = setInterval(progressTrack, speed);
    } else {
      clearInterval(progress);
      progress = null;
      progressStart = 0;
      progressBar.style.background = `conic-gradient(
				#17171a 360deg,
				#17171a 360deg
		  )`;
    }
  }

  function resetValues() {
    if (progress) {
      clearInterval(progress);
    }
    minutes = document.querySelector("#minutes").innerHTML;
    seconds = document.querySelector("#seconds").innerHTML;
    toggleSettings = false;
    minElem.contentEditable = false;
    minElem.style.borderBottom = `none`;
    secElem.contentEditable = false;
    secElem.style.borderBottom = `none`;
    progress = null;
    progressStart = 0;
    progressEnd = parseInt(minutes) * 60 + parseInt(seconds);
    degTravel = 360 / progressEnd;
    progressBar.style.background = `conic-gradient(
				#17171a 360deg,
				#17171a 360deg
		  )`;
  }

  startStop.onclick = function () {
    if (startStop.innerHTML === "START") {
      if (!(parseInt(minutes) === 0 && parseInt(seconds) === 0)) {
        startStop.innerHTML = "STOP";
        startStopProgress();
      } else {
        alert("Enter the Time Value in your Timer!");
      }
    } else {
      startStop.innerHTML = "START";
      startStopProgress();
    }
  };

  setting.onclick = function () {
    if (!toggleSettings) {
      toggleSettings = true;
      minElem.contentEditable = true;
      minElem.style.borderBottom = `1px dashed #ffffff50`;
      secElem.contentEditable = true;
      secElem.style.borderBottom = `1px dashed #ffffff50`;
    } else {
      resetValues();
    }
  };

  minElem.onblur = function () {
    resetValues();
  };

  secElem.onblur = function () {
    resetValues();
  };
};

const { notifyAudio, remind } = useRemind();
onMounted(init);
</script>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700&display=swap");

.tomatotimerContainer {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  .outerRing {
    display: grid;
    place-items: center;
    width: 415px;
    height: 415px;
    border-radius: 50%;
    box-shadow: -5px 14px 44px #000000, 5px -16px 50px rgba(255, 255, 255, 0.15);
    background: #17171a;
  }

  .timer {
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(
      71.4% 71.4% at 51.7% 28.6%,
      #3a393f 0%,
      #17171a 100%
    );
    box-shadow: inset 0px 0px 114px rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 8rem;
  }

  #time {
    width: 300px;
    text-align: center;
    margin: 3rem 0 0 0;
  }

  #time span {
    display: inline;
    color: #ffffff;
    font-family: "Bebas Neue", cursive;
    font-size: 7rem;
    letter-spacing: 0.1em;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  #stsp {
    color: #ffffff;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.25rem;
    text-align: center;
    letter-spacing: 0.6em;
    margin: 1rem 0;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  #setting {
    cursor: pointer;
    margin-top: 1rem;
    width: 25px;
    height: 25px;
    color: #fff;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  }

  .nodisplay {
    position: fixed;
    left: -99999px;
    visibility: hidden;
  }
}
</style>