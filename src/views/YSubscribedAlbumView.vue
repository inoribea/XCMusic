<template>
  <!-- 收藏的专辑界面 -->
  <div class="main">
    <div class="title font-color-main">
      {{ $t("subscribed_album") }}
    </div>
    <YPlaylistBiglist v-if="!loading" :type="'album'" :playlists="albums" />
    <YLoading style="margin-top: 100px; margin-bottom: 100px" v-else />
    <YPage v-model="page" />
  </div>
</template>

<script src="./YSubscribedAlbumView.ts" lang="ts"></script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;

  .title {
    text-align: left;
    font-size: 22px;
    font-weight: bold;
    margin: 20px 30px;
  }
}
</style>
