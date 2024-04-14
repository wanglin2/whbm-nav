<template>
  <div class="userContainer relative" @click.stop>
    <!-- 头像装饰-植物 -->
    <div class="botany iconfont icon-zhiwu absolute"></div>
    <!-- 头像 -->
    <div
      class="avatar rounded-1/2 flex justify-center items-center"
      @click="toggleDropdown()"
    >
      <img
        v-if="avatarUrl"
        class="img rounded-1/2 w-full h-full"
        :src="avatarUrl"
        alt=""
      />
      <span v-else class="icon iconfont icon-yonghu-xianxing"></span>
    </div>
    <!-- 下拉菜单 -->
    <div
      class="dropdownBox absolute animate__animated"
      :class="[
        showDropdown ? 'animate__fadeInUp' : 'animate__fadeOutDown',
        { show: showDropdown },
      ]"
    >
      <div class="dropdownList w-full">
        <template v-if="userInfo">
          <div class="dropdownItem w-full">
            <a href="../#/my" class="w-full h-full">
              <span class="icon iconfont icon-yonghu-xianxing"></span>
              <span class="text">{{ userName }}</span>
            </a>
          </div>
          <div class="dropdownItem w-full" @click="logout">
            <span class="icon iconfont icon-tuichu"></span>
            <span class="text">退出登录</span>
          </div>
        </template>
        <template v-else>
          <div class="dropdownItem w-full" @click="login">
            <span class="icon iconfont icon-denglu"></span>
            <span class="text">登录</span>
          </div>
          <div class="dropdownItem w-full">
            <a href="../#/register" class="w-full h-full">
              <span class="icon iconfont icon-zhuceyouli"></span>
              <span class="text">注册</span>
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api";
import { computed } from "vue";
import { useStore } from "vuex";
import { useDropDownMenu } from "@/hooks/dropdown";

// 初始化
const useInit = () => {
  const store = useStore();

  return {
    store,
  };
};

// 用户信息
const useUser = ({ store }) => {
  const userInfo = computed(() => {
    return store.state.userInfo;
  });
  const avatarUrl = computed(() => {
    return userInfo.value ? userInfo.value.userimg : "";
  });
  const userName = computed(() => {
    return userInfo.value ? userInfo.value.username : "";
  });

  // 去登录
  const login = () => {
    localStorage.setItem("LOGIN_CALLBACK_URL", location.origin + '/d');
    location.href =
      process.env.NODE_ENV === "development" ? "./index/#/login" : "../#/login";
  };

  // 退出登录
  const logout = async () => {
    await api.logout();
    location.reload();
  };

  return {
    userInfo,
    avatarUrl,
    userName,
    login,
    logout,
  };
};

// 下拉菜单
const useDropdown = () => {
  const { showDropdown, toggleDropdown } = useDropDownMenu();

  return {
    showDropdown,
    toggleDropdown,
  };
};

const { store } = useInit();
const { avatarUrl, userInfo, userName, login, logout } = useUser({ store });
const { showDropdown, toggleDropdown } = useDropdown();
</script>

<style lang="less" scoped>
.userContainer {
  .botany {
    font-size: 33px;
    top: -31px;
    left: 5px;
    z-index: -1;
    color: var(--dark-color);
  }

  .avatar {
    width: 50px;
    height: 50px;
    border: 2px solid var(--dark-color);
    padding: 5px;
    cursor: pointer;
    background-color: var(--light-color);

    .img {
      transform: rotate(0);
      transition: all 0.5s;

      &:hover {
        transform: rotate(360deg);
      }
    }

    .icon {
      font-size: 30px;
    }
  }

  .dropdownBox {
    width: 150px;
    border: 2px solid var(--dark-color);
    right: 0;
    top: 60px;
    border-radius: 5px;
    visibility: hidden;
    background-color: var(--light-color);
    z-index: 2;

    &.show {
      visibility: visible;
    }

    .dropdownList {
      .dropdownItem {
        height: 30px;
        border-bottom: 2px solid var(--other-dark-color);
        line-height: 30px;
        padding: 0 10px;
        cursor: pointer;
        color: var(--other-dark-color);

        &:last-of-type {
          border-bottom: none;
        }

        &:hover {
          .text {
            transform: translateX(-5px);
          }
        }

        .text {
          display: inline-block;
          transform: translateX(0px);
          transition: transform 0.5s;
        }

        .icon {
          display: inline-block;
          width: 25px;
        }

        a {
          display: inline-block;
        }
      }
    }
  }
}
</style>
