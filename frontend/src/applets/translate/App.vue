<template>
  <div class="translateContainer">
    <input type="text" id="hideInput" />
    <div class="contentBox">
      <!--选项按钮-->
      <div class="contentHeader">
        <!--语言选择-->
        <div class="chooseLang cursor">
          <!--源语言-->
          <div class="fromLang langCom">
            <span id="fromLang" data-lang="en">英语</span>
            <i class="iconDown" id="icon1"></i>
            <!--隐藏的语言-->
            <div class="hideLang fromHideLang">
              <div class="hideCover"></div>
              <h3>
                <span data-lang="auto">自动检测</span>
                <span data-lang="zh">中文</span>
                <span class="onit" data-lang="en">英语</span>
              </h3>
              <ul class="langMore">
                <li>
                  ABC
                  <dl>
                    <dd data-lang="ara">阿拉伯语</dd>
                    <dd data-lang="est">爱沙尼亚语</dd>
                    <dd data-lang="bul">保加利亚语</dd>
                    <dd data-lang="pl">波兰语</dd>
                  </dl>
                </li>
                <li>
                  DEFG
                  <dl>
                    <dd data-lang="dan">丹麦语</dd>
                    <dd data-lang="de">德语</dd>
                    <dd data-lang="ru">俄语</dd>
                    <dd data-lang="fra">法语</dd>
                    <dd data-lang="fin">芬兰语</dd>
                  </dl>
                </li>
                <li>
                  HIJKLMN
                  <dl>
                    <dd data-lang="kor">韩语</dd>
                    <dd data-lang="nl">荷兰语</dd>
                    <dd data-lang="cs">捷克语</dd>
                    <dd data-lang="rom">罗马尼亚语</dd>
                  </dl>
                </li>
                <li>
                  OPQRST
                  <dl>
                    <dd data-lang="pt">葡萄牙语</dd>
                    <dd data-lang="jp">日语</dd>
                    <dd data-lang="swe">瑞典语</dd>
                    <dd data-lang="slo">斯洛文尼亚语</dd>
                    <dd data-lang="th">泰语</dd>
                  </dl>
                </li>
                <li>
                  UVWX
                  <dl>
                    <dd data-lang="wyw">文言文</dd>
                    <dd data-lang="spa">西班牙语</dd>
                    <dd data-lang="el">希腊语</dd>
                    <dd data-lang="hu">匈牙利语</dd>
                  </dl>
                </li>
                <li>
                  YZ
                  <dl>
                    <dd data-lang="zh">中文</dd>
                    <dd data-lang="en">英语</dd>
                    <dd data-lang="it">意大利语</dd>
                    <dd data-lang="yue">粤语</dd>
                    <dd data-lang="cht">中文繁体</dd>
                  </dl>
                </li>
              </ul>
            </div>
          </div>
          <!--转换图标-->
          <div class="chooseIcon" id="toggleLang" data-flag="1"></div>
          <!--目标语言-->
          <div class="toLang langCom">
            <span id="toLang" data-lang="zh">中文</span>
            <i class="iconDown" id="icon2"></i>
            <!--隐藏的语言-->
            <div class="hideLang toHideLang">
              <div class="hideCover"></div>
              <h3>
                <span class="onit" data-lang="zh">中文</span>
                <span data-lang="en">英语</span>
              </h3>
              <ul class="langMore">
                <li>
                  ABC
                  <dl>
                    <dd data-lang="ara">阿拉伯语</dd>
                    <dd data-lang="est">爱沙尼亚语</dd>
                    <dd data-lang="bul">保加利亚语</dd>
                    <dd data-lang="pl">波兰语</dd>
                  </dl>
                </li>
                <li>
                  DEFG
                  <dl>
                    <dd data-lang="dan">丹麦语</dd>
                    <dd data-lang="de">德语</dd>
                    <dd data-lang="ru">俄语</dd>
                    <dd data-lang="fra">法语</dd>
                    <dd data-lang="fin">芬兰语</dd>
                  </dl>
                </li>
                <li>
                  HIJKLMN
                  <dl>
                    <dd data-lang="kor">韩语</dd>
                    <dd data-lang="nl">荷兰语</dd>
                    <dd data-lang="cs">捷克语</dd>
                    <dd data-lang="rom">罗马尼亚语</dd>
                  </dl>
                </li>
                <li>
                  OPQRST
                  <dl>
                    <dd data-lang="pt">葡萄牙语</dd>
                    <dd data-lang="jp">日语</dd>
                    <dd data-lang="swe">瑞典语</dd>
                    <dd data-lang="slo">斯洛文尼亚语</dd>
                    <dd data-lang="th">泰语</dd>
                  </dl>
                </li>
                <li>
                  UVWX
                  <dl>
                    <dd data-lang="wyw">文言文</dd>
                    <dd data-lang="spa">西班牙语</dd>
                    <dd data-lang="el">希腊语</dd>
                    <dd data-lang="hu">匈牙利语</dd>
                  </dl>
                </li>
                <li>
                  YZ
                  <dl>
                    <dd data-lang="zh">中文</dd>
                    <dd data-lang="en">英语</dd>
                    <dd data-lang="it">意大利语</dd>
                    <dd data-lang="yue">粤语</dd>
                    <dd data-lang="cht">中文繁体</dd>
                  </dl>
                </li>
              </ul>
            </div>
          </div>
          <!--翻译按钮-->
          <div class="okButton cursor" id="ok">翻译</div>
        </div>
      </div>
      <!--翻译框-->
      <div class="contentBody">
        <div class="fromTextArea">
          <textarea name="fromTextInput" id="fromTextInput"></textarea>
          <span id="clearInput" class="cursor">×</span>
        </div>
        <div class="toTextArea">
          <div id="toResult"></div>
          <div class="tool">
            <span class="toolCopy"
              ><i class="hideWord">复制<b></b></i
            ></span>
          </div>
        </div>
      </div>
      <!--提示消息-->
      <div class="warn"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

let jsList = [
  "http://lxqnsys.com/js/jquery-3.0.0.min.js",
  "http://lxqnsys.com/%E5%AD%A6%E4%B9%A0/js-sdk/md5.js",
];
let elList = [];

onMounted(async () => {
  let taskList = jsList.map((url) => {
    return new Promise((resolve, reject) => {
      let el = document.createElement("script");
      el.src = url;
      el.onload = () => {
        resolve();
      };
      el.onerror = (e) => {
        reject(e);
      };
      document.body.appendChild(el);
      elList.push(el);
    });
  });
  await Promise.all(taskList);
  let $ = window.$;

  $(function () {
    //选择语言下拉
    changeLang(".fromHideLang", "#fromLang");
    changeLang(".toHideLang", "#toLang");
    new HideNavClass(
      ".fromLang",
      ".fromHideLang",
      "click",
      "#icon1",
      "iconDown",
      "iconUp"
    );
    new HideNavClass(
      ".toLang",
      ".toHideLang",
      "click",
      "#icon2",
      "iconDown",
      "iconUp"
    );
    //提示小标题
    new HideNavClass(".toolSpeek", ".toolSpeek i", "mouseenter");
    new HideNavClass(".toolCopy", ".toolCopy i", "mouseenter");
    new HideNavClass(".toolLove", ".toolLove i", "mouseenter");
    new HideNavClass(".toolWrite", ".toolWrite i", "mouseenter");
    new HideNavClass(".loveWords", ".loveWords i", "mouseenter");
    new HideNavClass(".setButton", ".setButton i", "mouseenter");
  });
  //选择语言下拉公共函数
  function changeLang(boxId, titleId) {
    $(boxId + " h3 span").each(function (index, element) {
      $(this).bind("click", function () {
        com($(this));
      });
    });
    $(boxId + " ul li dl dd").each(function (index, element) {
      $(this).bind("click", function () {
        com($(this));
      });
    });
    function com($t) {
      $(boxId + " h3 span").removeClass("onit");
      $(boxId + " ul li dl dd").removeClass("onit");
      $t.addClass("onit");
      $(titleId).text($t.text());
      $(titleId).attr({ "data-lang": $t.attr("data-lang") });
    }
  }
  //对换语言
  (function () {
    $("#toggleLang").bind("click", function () {
      var from = $("#fromLang").text();
      var flang = $("#fromLang").attr("data-lang");
      var to = $("#toLang").text();
      var tlang = $("#toLang").attr("data-lang");
      $("#fromLang").text(to).attr({ "data-lang": tlang });
      $("#toLang").text(from).attr({ "data-lang": flang });
      var flag = $(this).attr("data-flag");
      if (flag == 1) {
        $(this).css({ transform: "rotate(180deg)" });
        $(this).attr({ "data-flag": "0" });
      } else if (flag == 0) {
        $(this).css({ transform: "rotate(0deg)" });
        $(this).attr({ "data-flag": "1" });
      }
      findThisLang();
    });
  })();
  //重新高亮当前选择的语言
  function findThisLang() {
    findThisLangCom(".fromHideLang", "#fromLang");
    findThisLangCom(".toHideLang", "#toLang");
  }
  function findThisLangCom(id, bu) {
    $(id + " h3 span")
      .removeClass("onit")
      .each(function (index, element) {
        if ($(bu).text() == $(this).text()) {
          $(this).addClass("onit");
          return false;
        }
      });
    $(id + " ul li dl dd")
      .removeClass("onit")
      .each(function (index, element) {
        if ($(bu).text() == $(this).text()) {
          $(this).addClass("onit");
          return false;
        }
      });
  }
  //提交
  (function () {
    //获取焦点时隐藏提示
    $("#fromTextInput").bind("focusin", function () {
      $(".warn").text("").slideUp();
    });
    //当输入框不为空时显示清除按钮
    $("#fromTextInput").bind("keyup", function () {
      if (!$(this).val()) {
        $("#clearInput").fadeOut(300);
      } else {
        $("#clearInput").fadeIn(300);
      }
    });
    //清除文本框
    $("#clearInput").bind("click", function () {
      $("#fromTextInput").val("");
      $("#toResult").text("");
      $(this).fadeOut(300);
    });
    //确认
    $("#ok").bind("click", function () {
      var va = $("#fromTextInput").val();
      if (!va) {
        $("#toResult").text("");
        showWran("输入框不得为空!");
      } else {
        send(va);
      }
    });
  })();
  //提示函数
  function showWran(msg) {
    var st;
    clearTimeout(st);
    $(".warn").text(msg).slideDown();
    st = setTimeout(function () {
      $(".warn").text(msg).slideUp();
      clearTimeout(st);
    }, 2000);
  }
  //发送接收函数
  function send(va) {
    var appid = "20160814000026743";
    var key = "evrUycUXMnBkioXqNHMu";
    var salt = new Date().getTime();
    var query = va;
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    var from = $("#fromLang").attr("data-lang");
    var to = $("#toLang").attr("data-lang");
    var str1 = appid + query + salt + key;
    var sign = MD5(str1);
    $.ajax({
      url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
      type: "get",
      dataType: "jsonp",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
      },
      success: function (msg) {
        showResult(msg);
      },
    });
  }
  //显示结果
  function showResult(msg) {
    if (!msg || !msg.trans_result) {
      return;
    }
    var res = msg.trans_result[0].dst;
    if (res) {
      $("#toResult").text(res);
    }
  }
  //修改结果
  (function reWriteResult() {
    $(".toolWrite").bind("click", function () {
      $("#toResult").attr({ contentEditable: "true" });
    });
  })();
  //实时搜索
  function searchRightNow() {
    let timer = null
    $("#fromTextInput").bind("keyup", function () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        $("#ok").trigger("click");
      }, 500);
    });
  }
  searchRightNow();
  //复制翻译结果
  (function paste() {
    $(".toolCopy").on("click", function () {
      $("#hideInput").val($("#toResult").text().trim());
      var e = document.getElementById("hideInput"); //对象是content
      e.select(); //选择对象
      document.execCommand("Copy"); //执行浏览器复制命令
      showWran("复制成功!");
    });
  })();
  //下拉菜单类
  function HideNavClass(
    clickId,
    hideId,
    triggerType,
    toggleClassId,
    nowClass,
    toggleClass
  ) {
    this.cId = clickId;
    this.clickId = $(clickId);
    this.hideId = $(hideId);
    this.triggerType = triggerType;
    this.toggleClassId = $(toggleClassId) || "";
    this.nowClass = nowClass || "";
    this.toggleClass = toggleClass || "";
    this.flag = 0;

    this.events();
    this.hideIt();
  }
  HideNavClass.prototype = {
    events: function () {
      var that = this;
      if (that.triggerType == "click") {
        this.clickId.bind(that.triggerType, function (e) {
          if (that.flag == 0) {
            that.hideId.fadeIn(300);
            if (that.toggleClassId) {
              that.toggleClassId.removeClass(that.nowClass);
              that.toggleClassId.addClass(that.toggleClass);
            }
            that.flag = 1;
          } else if (that.flag == 1) {
            that.hideCom(that);
          }
          e.stopPropagation();
          e.preventDefault();
        });
      } else if (that.triggerType == "mouseenter") {
        this.clickId
          .bind(that.triggerType, function (e) {
            that.hideId.fadeIn(300);
            if (that.toggleClassId) {
              that.toggleClassId.removeClass(that.nowClass);
              that.toggleClassId.addClass(that.toggleClass);
            }
            e.stopPropagation();
            e.preventDefault();
          })
          .bind("mouseleave", function (e) {
            that.hideCom(that);
            e.stopPropagation();
            e.preventDefault();
          });
      }
    },
    hideIt: function () {
      var that = this;
      $(document).bind("click", function () {
        that.hideCom(that);
      });
    },
    hideCom: function (that) {
      that.hideId.fadeOut(200);
      if (that.toggleClassId) {
        that.toggleClassId.removeClass(that.toggleClass);
        that.toggleClassId.addClass(that.nowClass);
      }
      that.flag = 0;
    },
  };
});

onUnmounted(() => {
  elList.forEach((el) => {
    document.body.removeChild(el);
  });
});

</script>

<style lang="less" scoped>
.translateContainer {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
}

/*主体*/
.contentBox {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
.contentHeader {
  width: 100%;
  margin-bottom: 20px;
  height: 30px;
}
/*语言*/
.chooseLang {
  float: left;
}
.chooseLang div {
  float: left;
}
.chooseLang .langCom {
  height: 30px;
  background-color: #fff;
  width: 120px;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #7f8c8d;
  position: relative;
  cursor: pointer;
}
.chooseLang .langCom:hover {
  color: rgb(84, 150, 136);
}
.chooseLang .langCom i {
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  position: relative;
}
.chooseLang .langCom .iconDown {
  border-top: 5px solid #7f8c8d;
  top: 4px;
}
.chooseLang .langCom .iconUp {
  border-bottom: 5px solid #7f8c8d; /*字体颜色*/
  bottom: 2px;
}
.hideLang {
  position: absolute;
  width: 340px;
  padding: 10px;
  left: -1px;
  border: 1px solid #dcdcdc;
  background-color: #fff;
  z-index: 2;
  display: none;
}
.hideLang h3 {
  border-bottom: 1px solid #f5f5f5;
  text-align: left;
  font-size: 14px;
  padding: 10px 0;
}
.hideLang h3 span {
  display: inline-block;
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
}
.hideLang h3 span:hover {
  background-color: #eef2fc;
}
.hideLang h3 .onit {
  background-color: #eef2fc;
  border-radius: 3px;
}
.hideLang .langMore li {
  float: left;
  width: 100px;
  font-size: 12px;
  height: 200px;
}
.hideLang .langMore li dl dd {
}
.hideLang .langMore li dl dd:hover {
  background-color: #eef2fc;
}
.hideLang ul li dl .onit {
  background-color: #eef2fc;
  border-radius: 3px;
}
.hideLang .hideCover {
  width: 176px;
  height: 3px;
  position: absolute;
  left: 0;
  top: -1px;
  background-color: #fff;
}
.toHideLang {
  left: auto;
  right: -49px;
}
.chooseLang .chooseIcon {
  width: 21px;
  height: 30px;
  background: url(http://assets.lxqnsys.com/exchange1x_37fd099.png) no-repeat;
  background-position: -2px 50%;
  margin: 0 15px;
  transition: all 0.5s;
  cursor: pointer;
}
.chooseLang .okButton {
  width: 100px;
  height: 30px;
  background-color: rgb(84, 150, 136); /*墨绿色*/
  color: #fff;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  margin-left: 15px;
  cursor: pointer;
}
.chooseLang .okButton:hover {
  background-color: rgb(84, 150, 116);
}
.chooseLang .okButton:active {
  background-color: rgb(84, 140, 116);
}

/*翻译框*/
.contentBody {
  width: 100%;
  overflow: hidden;
}
.contentBody div {
  float: left;
}
.contentBody .fromTextArea {
  width: 100%;
  height: 198px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  transition: all 0.3s;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.contentBody .fromTextArea #fromTextInput {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: #fff;
  padding: 10px;
  color: #7f8c8d;
  resize: none;
}
.contentBody .fromTextArea:hover {
  border-color: rgb(84, 150, 136);
}
.contentBody .fromTextArea #clearInput {
  position: absolute;
  right: 10px;
  top: 10px;
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(84, 150, 136);
  font-size: 25px;
  border-radius: 50%;
  display: none;
  cursor: pointer;
}
.contentBody .fromTextArea #clearInput:hover {
  background-color: #f0f0f0;
}
.contentBody .toTextArea {
  width: 100%;
  height: 180px;
  padding: 10px;
  color: rgb(84, 150, 136);
  background-color: #f0f0f0;
  position: relative;
}
#toResult {
  width: 100%;
  height: 150px;
}

.warn {
  line-height: 30px;
  color: #f60;
  font-family: 黑体;
  height: 30px;
  clear: both;
  display: none;
}

/*结果工具条*/
.tool {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
}
.tool span {
  display: inline-block;
  float: left;
  width: 27px;
  height: 22px;
  margin-left: 10px;
  background: url(http://assets.lxqnsys.com/icons_80cc695.png) no-repeat;
  position: relative;
}
.hideWord {
  position: absolute;
  display: block;
  top: -30px;
  height: 20px;
  background-color: rgb(84, 150, 136);
  color: #fff;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  width: 60px;
  text-align: center;
  left: -20px;
  display: none;
}
.hideWord b {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top-color: rgb(84, 150, 136) !important;
  position: absolute;
  bottom: -10px;
  left: 25px;
}

.tool .toolSpeek {
  background-position: -74px -90px;
}
.tool .toolSpeek:hover {
  background-position: -124px -90px;
}
.tool .toolCopy {
  background-position: -75px -130px;
  cursor: pointer;
}
.tool .toolCopy:hover {
  background-position: -127px -130px;
}
.tool .toolLove {
  background-position: -75px -170px;
}
.tool .toolLove:hover {
  background-position: -125px -170px;
}
.tool .toolWrite {
  background-position: -272px -77px;
}
.tool .toolWrite:hover {
  background-position: -245px -77px;
}
.tool .onoffBox {
  float: right;
  height: 20px;
}
.tool .onoffBox p {
  float: left;
  line-height: 23px;
  margin-right: 5px;
}
.tool .onoffBox .onoffButton {
  width: 42px;
  height: 20px;
  display: inline-block;
}
.tool .onoffBox .checkoff {
  background: url(http://assets.lxqnsys.com/op-check-off_1ebc587.png) no-repeat;
}
.tool .onoffBox .checkoon {
  background: url(http://assets.lxqnsys.com/op-check-on_f110e03.png) no-repeat;
}
#hideInput {
  position: fixed;
  left: 0;
  top: -500px;
}
</style>