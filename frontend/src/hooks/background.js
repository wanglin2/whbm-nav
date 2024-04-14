import { useStore } from 'vuex';
import { computed, watch, onMounted, ref } from 'vue';
import { hexToRgb } from '@/utils';
import cssVariables from '@/config/cssVariables';

export const useOpacityBackground = (backgroundColor) => {
    const elContainer = ref(null);
    const store = useStore()
    const opacity = computed(() => {
        return store.state.userConfig ? store.state.userConfig.theme.opacity : 1;
    })
    const mode = computed(() => {
        return store.state.userConfig ? store.state.userConfig.mode : 'light';
    })
    const setColor = () => {
        backgroundColor = cssVariables.getCssVariables(mode.value)['--light-color']
        let color = hexToRgb(backgroundColor)
        elContainer.value.style.backgroundColor = `rgba(${color.r},${color.g},${color.b}, ${opacity.value})`
    }

    onMounted(() => {
        watch([
            () => {
                return opacity.value;
            },
            () => {
                return store.state.userConfig.theme.colors;
            }
        ], setColor, {
            deep: true
        })
        setColor()
    });

    return {
        elContainer
    };
}