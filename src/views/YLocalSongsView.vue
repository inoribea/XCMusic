<template>
    <div class="main">
        <YHeader :switcher="switcher" @new-position="handlePosition" />
        <YSongsTable :resortable="false" :canSendPlaylist="false" :showHeader="false" v-model="tracks"
            :showTrackPopularity="false" :id="'YLocalSongsView.vue'" v-if="position === 'download'" />
        <YSongsTable :resortable="false" :canSendPlaylist="false" :showHeader="false" v-model="tracks"
            :showTrackPopularity="false" :show-track-likes="false" :id="'YLocalSongsView.vue-2'" v-else />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import YSongsTable from '@/components/YSongsTable.vue';
import YHeader from '@/components/YHeader.vue';
import { TrackIds, Tracks } from '@/utils/tracks';
import { YColor } from '@/utils/color';

export default defineComponent({
    name: 'YLocalSongsView',
    components: {
        YSongsTable,
        YHeader,
    },
    setup() {
        const store = useStore();
        return {
            download: store.state.download,
            setting: store.state.setting,
        }
    },
    computed: {
    },
    data() {
        return {
            tracks: [] as any,
            position: 'download',
            switcher: [
                {
                    num: 0,
                    showNum: false,
                    position: 'download',
                    display: 'header.local_music.downloaded_songs',
                },
                {
                    num: 0,
                    showNum: false,
                    position: 'local',
                    display: 'header.local_music.local_songs',
                },
            ],
        };
    },
    methods: {
        async getDownloadedTracks() {
            const ids = this.download.downloadedSongIds;
            const temp = new TrackIds(ids);
            await temp.initData();
            this.tracks = temp.tracks;
        },
        async handlePosition(position: string) {
            this.position = position;
            if (position === 'download') {
                this.getDownloadedTracks();
            } else {
                const res = await window.electron.ipcRenderer.invoke('get-local-tracks', this.setting.download.path);
                this.tracks = (new Tracks({
                    url: 'local',
                    tracks: res,
                })).tracks;
            }
        },
    },
    mounted() {
        YColor.setBackgroundColorTheme();
        this.getDownloadedTracks();
        this.download.subscriber.on({
            id: 'YLocalSongsView',
            type: 'downloaded-songs',
            func: async () => {
                await this.getDownloadedTracks();
            }
        })
    },
    beforeUnmount() {
        this.download.subscriber.offAll('YLocalSongsView');
    },
})
</script>

<style lang="scss" scoped>
.main {
    padding: 0;
}
</style>