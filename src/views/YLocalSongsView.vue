<template>
  <!-- 本地音乐界面 -->
  <div class="main">
    <div class="title">
      {{ $t("local_music") }}
    </div>
    <div class="local">
      <div class="path-info font-color-main">
        <div class="path-title">
          {{ $t("localsongs.addpaths") + " :" }}
        </div>
        <div class="path-list font-color-high">
          <div class="path-item" v-for="path in localPaths">
            {{ path }}
          </div>
        </div>
      </div>
      <YSongsTableSkeleton style="margin-top: 10px" v-if="loading" />
      <YSongsTable
        v-else
        :resortable="false"
        :canSendPlaylist="false"
        :showHeader="false"
        v-model="localTracks"
        :showTrackPopularity="false"
        :show-track-likes="false"
        :id="'YLocalSongsView.vue-2'"
      />
    </div>
  </div>
</template>

<script src="./YLocalSongsView.ts" lang="ts"></script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
  text-align: left;

  .title {
    width: inherit;
    margin: 15px 30px;
    color: var(--font-color-main);
    text-align: left;
    font-size: 22px;
    font-weight: bold;
    margin: 20px 30px;
  }

  .local {
    width: 100%;

    .path-info {
      padding: 0 0 0px 30px;
      width: fit-content;
      font-weight: bold;
      text-align: left;

      .path-title {
        font-size: 16px;
        margin-bottom: 5px;
      }

      .path-list {
        font-size: 14px;

        .path-item {
          padding: 5px 0;
        }
      }
    }
  }
}
</style>
