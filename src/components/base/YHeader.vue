<template>
  <!-- 顶部导航组件 -->
  <div class="switcher font-color-standard">
    <!-- 导航元素 -->
    <button
      :tabindex="-1"
      class="switcher-item"
      v-for="(item, index) in switcher"
      @click="handleSwitcher(item.position)"
    >
      <div
        :class="{ 'choosed-text': item.position === position }"
        :style="{
          'font-weight':
            item.position === position ? 'bold' : 'var(--font-weight-header)',
          color:
            item.position === position
              ? 'var(--font-color-main)'
              : 'var(--font-color-standard)',
        }"
      >
        {{ $t(item.display) }}
        <!-- 选中效果 -->
        <div class="choosed" style="" v-if="item.position === position"></div>
      </div>
      <!-- 数字 -->
      <div
        class="number font-size-smaller font-color-main"
        v-if="item.showNum"
        :style="{ color: item.position === position ? '#fff' : '#bbb' }"
      >
        {{ item.num }}
      </div>
    </button>
  </div>
</template>

<script src="./YHeader.ts" lang="ts"></script>

<style lang="scss" scoped>
.switcher {
  display: flex;
  align-items: center;
  padding-top: 10px;
  margin-left: 10px;
  padding-bottom: 20px;
  top: 0px;
  z-index: 1;
  width: 100%;

  .switcher-item {
    display: inline-flex;
    font-size: var(--font-size-header);
    flex-direction: row;
    position: relative;
    height: 20px;
    margin: 0 7px;
    background-color: transparent;
    border: none;
    cursor: pointer;

    .choosed-text {
      color: rgb(var(--highlight-color-rgb));

      .choosed {
        height: 2px;
        background-color: rgb(var(--highlight-color-rgb));
        transform: translate(7px, 4px);
        width: calc(100% - 14px);
        height: 4px;
        border-radius: 2px;
      }
    }

    .number {
      margin: 0;
      padding: 0px 0px 0px 3px;
      font-weight: bold;
      left: 0;
      top: 0;
    }
  }
}
</style>
