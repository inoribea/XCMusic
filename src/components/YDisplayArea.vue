<template>
    <div>
        <div class="display-area" id="display-area-main">
            <YScroll style="height: calc(100% - 8px);max-height: calc(100% - 8px);">
                <RouterView />
            </YScroll>
        </div>
    </div>
</template>

<script>
import YScroll from './YScroll.vue';

export default {
    name: 'YDisplayarea',
    components: {
        YScroll
    }
};
</script>

<style scoped>
.display-area {
    border: none;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: relative;
    z-index: 0;
    overflow: hidden;
}
</style>