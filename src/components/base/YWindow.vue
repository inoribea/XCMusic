<template>
  <!-- 窗口组件，预设了关闭图标和关闭事件。在HomeView中使用 -->
  <div class="window font-color-main" v-if="showWindow">
    <div class="window-header">
      <slot name="header">
        {{ $t("window.title") }}
      </slot>
      <img
        src="@/assets/close.svg"
        class="close-icon g-icon"
        @click="this.showWindow = false"
        :title="$t('window.close')"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script src="./YWindow.ts" lang="js"></script>

<style lang="scss" scoped>
.window {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--panel-background-color);
  width: 100%;
  border-radius: 5px;
  padding: 10px 0px;
  margin: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    width: calc(100% - 30px);
    padding: 0px 15px 10px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-icon {
      width: 14px;
      height: 14px;
      padding: 8px;
      cursor: pointer;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
