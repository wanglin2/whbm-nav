<template>
  <el-config-provider :locale="zhCn" :zIndex="5000">
    <div class="calendarContainer">
      <el-calendar v-model="value" v-if="showCalendar" ref="calendar">
        <template #header="{ date }">
          <div class="yearMonthSelectBox">
            <el-select
              v-model="currentYear"
              size="small"
              @change="currentYearChange"
            >
              <el-option
                v-for="item in yearList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="currentMonth"
              size="small"
              @change="currentMonthChange"
            >
              <el-option
                v-for="item in monthList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-button-group>
            <el-button size="small" @click="selectDate('prev-year')"
              >上一年</el-button
            >
            <el-button size="small" @click="selectDate('prev-month')"
              >上个月</el-button
            >
            <el-button size="small" @click="selectDate('today')"
              >今天</el-button
            >
            <el-button size="small" @click="selectDate('next-month')"
              >下个月</el-button
            >
            <el-button size="small" @click="selectDate('next-year')"
              >下一年</el-button
            >
          </el-button-group>
        </template>
        <template #dateCell="{ data }">
          <div
            class="cell"
            :class="[
              data.type,
              checkIsWeekend(data.date) ? 'weekend' : '',
              'worktime_' + getWorktime(data.date),
            ]"
          >
            <div class="gregorian">{{ data.day.split("-")[2] }}</div>
            <div class="lunar">{{ getLunar(data.day, data) }}</div>
            <div class="holidayMark mark">休</div>
            <div class="workMark mark">班</div>
          </div>
        </template>
      </el-calendar>
      <div class="info">
        <div class="left">
          <div class="date">{{ currentDate }}</div>
          <div class="day">{{ currentDate.split("-")[2] }}</div>
        </div>
        <div class="right" v-if="currentLunar">
          <div class="row">
            {{ currentLunar.lunarMonthName + currentLunar.lunarDayName }}
          </div>
          <div class="row">
            {{ currentLunar.GanZhiYear + "年 " + currentLunar.zodiac }}
          </div>
          <div class="row">
            {{
              currentLunar.GanZhiMonth + "月 " + currentLunar.GanZhiDay + "日"
            }}
          </div>
          <div
            class="row"
            v-if="
              currentLunar.solarFestival ||
              currentLunar.lunarFestival ||
              currentLunar.term
            "
          >
            •
            <span class="col" v-if="currentLunar.term">{{
              currentLunar.term
            }}</span>
            <span class="col" v-if="currentLunar.lunarFestival">{{
              currentLunar.lunarFestival
            }}</span>
            <span class="col" v-if="currentLunar.solarFestival">{{
              currentLunar.solarFestival
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import {
  ElCalendar,
  ElConfigProvider,
  ElButton,
  ElButtonGroup,
  ElSelect,
  ElOption,
} from "element-plus";
import "element-plus/es/components/calendar/style/css";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/button-group/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/option/style/css";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { ref, onUnmounted, computed, watch } from "vue";
import { useLoadJsResource } from "@/hooks/load";
import dayjs from "dayjs";
import worktimeList from "./worktime";

// 日历头部
const useCalendarHeader = ({ currentDate, value }) => {
  const calendar = ref(null);
  const currentYear = ref("");
  let _yearList = [];
  for (let i = 1900; i <= 2100; i++) {
    _yearList.push({
      label: i + "年",
      value: i,
    });
  }
  const yearList = ref(_yearList);
  const currentMonth = ref("");
  let _monthList = [];
  for (let i = 1; i <= 12; i++) {
    _monthList.push({
      label: i + "月",
      value: i,
    });
  }
  const monthList = ref(_monthList);

  const selectDate = (val) => {
    calendar.value.selectDate(val);
  };

  watch(
    currentDate,
    () => {
      let arr = currentDate.value.split("-");
      currentYear.value = Number(arr[0]);
      currentMonth.value = Number(arr[1]);
    },
    {
      immediate: true,
    }
  );

  const currentYearChange = () => {
    let arr = currentDate.value.split("-");
    value.value = new Date(currentYear.value, arr[1] - 1, arr[2]);
  };

  const currentMonthChange = () => {
    let arr = currentDate.value.split("-");
    value.value = new Date(arr[0], currentMonth.value - 1, arr[2]);
  };

  return {
    calendar,
    selectDate,
    currentYear,
    yearList,
    currentMonth,
    monthList,
    currentYearChange,
    currentMonthChange,
  };
};

// 日历农历显示
const useLunarCalendar = ({ load }) => {
  const showCalendar = ref(false);
  const value = ref(new Date());
  // 当前日期
  const currentDate = computed(() => {
    return dayjs(value.value).format("YYYY-MM-DD");
  });
  // 当前日期对应的农历数据
  const currentLunar = computed(() => {
    let date = dayjs(value.value).format("YYYY-MM-DD");
    return showCalendar.value
      ? window.LunarCalendar.solarToLunar(...date.split("-"))
      : "";
  });

  // 设置放假安排信息
  const setWorktime = () => {
    worktimeList.forEach((item) => {
      window.LunarCalendar.setWorktime(item);
    });
  };

  // 初始化
  const init = async () => {
    await load(["http://lxqnsys.com/js/LunarCalendar.min.js"]);
    setWorktime();
    showCalendar.value = true;
  };
  init();

  // 获取日期对应的农历数据
  const getLunar = (day) => {
    let lunar = window.LunarCalendar.solarToLunar(...day.split("-"));
    return (
      lunar.lunarFestival ||
      lunar.term ||
      lunar.solarFestival ||
      lunar.lunarDayName ||
      ""
    ).split(/\s+/)[0];
  };

  // 判断日期是否是周末
  const checkIsWeekend = (date) => {
    let w = dayjs(date).day();
    return w === 0 || w === 6;
  };

  // 获取节假日安排信息
  const getWorktime = (day) => {
    let date = dayjs(day).format("YYYY-MM-DD");
    let lunar = window.LunarCalendar.solarToLunar(...date.split("-"));
    return lunar.worktime;
  };

  return {
    showCalendar,
    value,
    getLunar,
    currentDate,
    currentLunar,
    checkIsWeekend,
    getWorktime,
  };
};

// 加载资源
const { load, unload } = useLoadJsResource();
onUnmounted(() => {
  unload();
});
const {
  showCalendar,
  value,
  getLunar,
  currentDate,
  currentLunar,
  checkIsWeekend,
  getWorktime,
} = useLunarCalendar({
  load,
});
const {
  calendar,
  selectDate,
  currentYear,
  yearList,
  currentMonth,
  monthList,
  currentYearChange,
  currentMonthChange,
} = useCalendarHeader({ currentDate, value });
</script>

<style lang="less" scoped>
.calendarContainer {
  width: 100%;
  height: 100%;
  overflow: auto;

  .yearMonthSelectBox {
    display: flex;

    /deep/ .el-select {
      width: 100px;
      margin-right: 5px;
    }
  }

  /deep/ .el-calendar-table {
    td {
      &.is-today {
        .cell {
          border: 2px solid #4e6ef2;
        }
      }

      &.is-selected {
        .cell {
          border: 2px solid #BDBFC8;

          &.worktime_2 {
            border: 2px solid #F38686;
          }
        }
      }
    }
  }

  .cell {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid transparent;

    &.weekend,
    &.worktime_2 {
      .gregorian {
        color: #f73131;
      }
    }

    &.worktime_1 {
      background-color: #f5f5f6;

      .workMark {
        display: block;
      }
    }

    &.worktime_2 {
      background-color: #fde3e4;

      .holidayMark {
        display: block;
      }
    }

    &.prev-month {
      opacity: 0.4;
    }

    &.next-month {
      opacity: 0.4;
    }

    .gregorian {
      color: #000;
      font-size: 18px;
    }

    .mark {
      position: absolute;
      left: 5px;
      top: 5px;
      font-size: 12px;
    }

    .holidayMark {
      color: #f73131;
      display: none;
    }

    .workMark {
      color: #626675;
      display: none;
    }

    .lunar {
      color: #333;
      font-size: 12px;
      text-align: center;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  /deep/ .el-calendar__body {
    padding-bottom: 0;

    .el-calendar-day {
      padding: 0;
    }
  }

  .info {
    background: #4e6ef2;
    color: #fff;
    margin: 0 20px;
    padding: 10px;
    display: flex;

    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 100px;

      .date {
        margin-bottom: 5px;
      }

      .day {
        width: 80px;
        height: 80px;
        font-size: 52px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .right {
      margin-left: 20px;
      display: flex;
      flex-direction: column;

      .row {
        margin-bottom: 5px;

        .col {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>