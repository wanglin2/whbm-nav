import { ref } from 'vue';
import api from '@/api';
import { weatherIconMap, weatherList } from '@/config/constants';
const isDev = process.env.NODE_ENV === "development"

// 天气
export const useWeather = async () => {
    const weatherText = ref('')
    const weatherIcon = ref('')
    const weatherInfo = ref(null)
    // 获取当前天气
    const getNowWeather = async () => {
        let cityInfo = await api.getCityInfo()
        let { data } = await api.getWeather('now', cityInfo.data.adcode)
        if (data && data.HeWeather6 && data.HeWeather6[0]) {
            let _data = data.HeWeather6[0]
            weatherInfo.value = _data;
            weatherText.value = _data.now.cond_txt;
            weatherIcon.value = ((isDev ? 'http://lxqnsys.com/img/' : '../img/') + (weatherIconMap[weatherText.value] || weatherList[0].icon))
        }
    }
    await getNowWeather()

    return {
        weatherIcon,
        weatherText,
        weatherInfo
    };
}

// 沉浸式天气
export const useImmersiveWeather = async () => {
    const { weatherText } = await useWeather()
    let snow = []
    let stop = () => { }
    let showFrost = ref(false)
    if (weatherText.value.includes('雨') || weatherText.value.includes('雪')) {
        if (weatherText.value.includes('雨')) {
            snow.push(new window.Snows({
                isRain: true,
                num: 100,
                maxSpeed: 20,
                minSpeed: 10
            }))
        }
        if (weatherText.value.includes('雪')) {
            snow.push(new window.Snows())
        }
        stop = () => {
            if (snow.length <= 0) {
                return;
            }
            snow.forEach((item) => {
                item.snowList.forEach((item) => {
                    document.body.removeChild(item.el)
                })
            })
        }
    }
    if (weatherText.value.includes('霜') || weatherText.value.includes('冻')) {
        showFrost.value = true
        stop = () => {
            showFrost.value = false
        }
    }

    return {
        showFrost,
        stop
    };
}