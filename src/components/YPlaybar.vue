<template>
    <!-- 0 播放栏 -->
    <div class="big-progress" v-if="type === 'play-ui'">
        <YProgressBar v-model="progress" style="height: 20px; width: 100%;" @update:model-value="setAudioProgress"
            :show-track="false" ref="progressBarNoTrack" />
    </div>
    <div class="playbar font-color-main">
        <!-- 1 左侧 -->
        <div class="align-left" :key="currentTrack?.id">
            <!-- 2 播放信息 -->
            <div class="play-info" @mouseover="setShowButton" @mouseleave="showButton = false">
                <div class="play-info-left" v-if="type === 'default'">
                    <!-- 3 封面 -->
                    <img class="img-cover img" :src="currentTrackCover ?? require('../assets/song.svg')"
                        :key="currentTrackCover">
                    <div class="open-panel" @click="$emit('open-panel')">
                        <div class="open-panel-overlay">
                        </div>
                        <img class="img-cover img img-open-panel" src="../assets/less.svg" />
                    </div>
                    <!-- 4 播放信息文本 -->
                    <div class="play-info-text">
                        <!-- 5 播放信息文本:标题 -->
                        <div class="play-info-text-title" :title="currentTrackName" :key="currentTrackName">
                            <YTextBanner :text="currentTrackName" style="width: 100%; overflow: hidden;" />
                        </div>
                        <!-- 5 播放信息文本:艺术家 -->
                        <div class="play-info-text-artist font-color-standard">
                            <span v-for="(artist, index) in this.currentTrackArtists" :key="artist.id">
                                <!-- 艺术家名 -->
                                <span @click="handleArtistClick(artist.id)" class="artist-button"
                                    :title="artist.name + (artist.tns ? ('\n' + artist.tns) : '')" :key="artist.id">
                                    {{ artist.name }}
                                </span>
                                <span v-if="index < currentTrackArtists.length - 1"> /&nbsp; </span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 歌曲操作按钮 -->
                <div class="play-info-right" v-if="showButton || type === 'play-ui'">
                    <div v-if="type === 'play-ui'" class="close-button" @click="$emit('close-panel')">
                        <img class="img-close-panel" src="../assets/more.svg" />
                    </div>
                    <img class="img-subscribe play-info-ico" src="../assets/subscribe.svg" title="收藏到歌单">
                    <img class="img-download play-info-ico" src="../assets/smalldownload.svg" title="下载">
                    <div class="song-comment">
                        <img class="img-comment play-info-ico" src="../assets/comment2.svg" title="评论"
                            @click="this.$router.push({ path: `/comment/song/${currentTrack?.id}` })">
                        <div class="song-comment-num">
                            {{ currentTrackComment }}
                        </div>
                    </div>
                    <div class="play-info-time font-color-standard" v-if="type === 'play-ui'">
                        {{ currentTime ? formatDuration(currentTime) : '00:00' }} / {{ formatDuration(this.duration) }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 1 中间 -->
        <div class="align-center">
            <!-- 2 控制按钮 -->
            <div class="buttons">
                <!-- 3 喜欢按钮 -->
                <button class="button like-button" @click="_toogleLike(likelist.includes(currentTrack?.id))"
                    :key="currentTrack?.id">
                    <img class="img-like img" src="../assets/likes.svg" v-if="likelist.includes(currentTrack?.id)"
                        title="取消喜欢">
                    <img v-else class="img-like img" src="../assets/unlikes.svg" title="喜欢">
                </button>
                <!-- 3 上一首按钮 -->
                <button class="button previous-button" @click="goTo('backwards')" title="上一首">
                    <img class="img-previous img" src="../assets/previous.svg">
                </button>
                <!-- 3 播放/暂停按钮 -->
                <button class="button play-button" @click="tooglePlayState" :title="playState === 'pause' ? '播放' : '暂停'"
                    :key="playState">
                    <img v-show="playState === 'pause'" class="img-play img" src="../assets/play.svg">
                    <img v-show="playState === 'play'" class="img-pause img" src="../assets/pause.svg">
                </button>
                <!-- 3 下一首按钮 -->
                <button class="button next-button" @click="goTo('forward')" title="下一首">
                    <img class="img-next img" src="../assets/next.svg">
                </button>
                <!-- 3 播放模式按钮 -->
                <button class="button playMode-button" @click="this.$refs.play_mode_panel.tooglePanel()"
                    ref="play_mode_panel_trigger">
                    <img v-if="playMode === 'order'" class="img-order img" src="../assets/order.svg" title="顺序播放">
                    <img v-if="playMode === 'listloop'" class="img-listloop img" src="../assets/listloop.svg"
                        title="列表循环">
                    <img v-if="playMode === 'random'" class="img-random img" src="../assets/random.svg" title="随机播放">
                    <img v-if="playMode === 'listrandom'" class="img-random img" src="../assets/listrandom.svg"
                        title="列表随机" style="opacity: 1;">
                    <img v-if="playMode === 'loop'" class="img-loop img" src="../assets/loop.svg" title="单曲循环">
                </button>
                <!-- 选择播放模式面板 -->
                <YPanel :default-show="false" ref="play_mode_panel" :trigger="this.$refs.play_mode_panel_trigger"
                    :slide-direction="5" :hide-mode="'show'" :slide-distance="8" :animation-time="0.1">
                    <div class="playMode-switcher">
                        <div class="playMode-item"
                            @click="tooglePlayMode('order'); this.$refs.play_mode_panel.tooglePanel()">
                            <img class="img-order img playMode-img" src="../assets/order.svg">顺序播放
                        </div>
                        <div class="playMode-item"
                            @click="tooglePlayMode('listloop'); this.$refs.play_mode_panel.tooglePanel()">
                            <img class="img-listloop img playMode-img" src="../assets/listloop.svg">列表循环
                        </div>
                        <div class="playMode-item"
                            @click="tooglePlayMode('random'); this.$refs.play_mode_panel.tooglePanel()">
                            <img class="img-random img playMode-img" src="../assets/random.svg">随机播放
                        </div>
                        <div class="playMode-item"
                            @click="tooglePlayMode('listrandom'); this.$refs.play_mode_panel.tooglePanel()">
                            <img class="img-random img playMode-img" src="../assets/listrandom.svg">列表随机
                        </div>
                        <div class="playMode-item"
                            @click="tooglePlayMode('loop'); this.$refs.play_mode_panel.tooglePanel()">
                            <img class="img-loop img playMode-img" src="../assets/loop.svg">单曲循环
                        </div>
                    </div>
                </YPanel>
            </div>
            <!-- 2 进度条 -->
            <div class="progress" v-if="type === 'default'">
                <!-- 3 自定义进度条 -->
                <div class="time font-color-main" :key="currentTime">
                    {{ currentTime ? formatDuration(currentTime) : '00:00' }}
                </div>
                <YProgressBar v-model="progress" style="height:20px;width: 321px"
                    @update:model-value="setAudioProgress" />
                <div class="time font-color-main" :key="this.duration">
                    {{ formatDuration(this.duration) }}
                </div>
            </div>
        </div>
        <!-- 1 右侧 -->
        <div class="align-right">
            <div class="buttons" style="margin-right: 10px;">
                <!-- 音质按钮 -->
                <div class="quality-button font-color-standard" ref="quality_panel_trigger"
                    @click="this.$refs.quality_panel.tooglePanel()" title="选择音质">
                    {{ qualityDisplay }}
                </div>
                <!-- 选择音质面板 -->
                <YPanel ref="quality_panel" :trigger="this.$refs.quality_panel_trigger" :slide-direction="4"
                    :default-show="false" :animation-time="0.1" :slide-distance="15">
                    <div class="quality-panel">
                        <div class="quality-title font-color-main">
                            歌曲音质
                        </div>
                        <div class="quality-switcher">
                            <div class="quality-item" v-for="quality in qualityGroup" :key="quality.id"
                                @click="setQuality(quality.name)" :style="{ 'opacity': quality.available ? 1 : .4 }">
                                <div class="quality-item-title font-color-high">
                                    {{ quality.display }}
                                </div>
                                <div class="quality-item-desc font-color-standard">
                                    {{ quality.size + ' ' + quality.desc }}
                                </div>
                            </div>
                        </div>
                    </div>
                </YPanel>
                <!-- 音量按钮 -->
                <img class="img" src="../assets/volume.svg"
                    style="width: 22px; height: 22px;margin-right:10px; cursor: pointer; opacity: 0.9;" title="音量"
                    ref="volume_panel_trigger" @click="this.$refs.volume_panel.tooglePanel()">
                <!-- 音量面板 -->
                <YPanel ref="volume_panel" :trigger="this.$refs.volume_panel_trigger" :slide-direction="5"
                    :animation-time="0.1" :slide-distance="10">
                    <div class="volume-container">
                        <YProgressBarV v-model="volume"
                            style="height: 120px;width: 20px;position: absolute; bottom: 30px;"
                            @set-progress-end="this.updateVolumeInSetting" />
                        <div class="volume-text">
                            {{ Math.round(volume * 100) + '%' }}
                        </div>
                    </div>
                </YPanel>
                <!-- 播放列表按钮 -->
                <img class="img" src="../assets/playlist.svg"
                    style="width: 20px; height: 20px; margin-left:10px; cursor: pointer; opacity: 0.8;"
                    @click="this.$refs.playlist_panel.tooglePanel" title="播放列表" ref="playlist_panel_trigger">
                <!-- 播放列表面板 -->
                <YPanel ref="playlist_panel" :trigger="this.$refs.playlist_panel_trigger" :slide-direction="4"
                    :default-show="false">
                    <div class="playlist-container">
                        <div class="playlist-title">
                            <div class="title-left font-color-main">
                                <span>播放列表</span>
                                <div class="songs-count"
                                    style="color:#fff; margin:0;padding:0 20px 0px 5px;font-size: 13px; font-weight: bold;">
                                    {{ playlist.length }}
                                </div>
                            </div>
                            <div class="title-right">
                                <span @click="this.player.clearPlaylist()" style="cursor: pointer;">
                                    <img src="../assets/delete.svg"
                                        style="width: 20px; height: 20px;margin-right: 8px; opacity: .8;"
                                        title="清空播放列表">
                                </span>
                            </div>
                        </div>
                        <div class="playlist-header font-color-standard">
                            <div class="playlist-header-item">标题</div>
                            <div class="playlist-header-item">喜欢</div>
                        </div>
                        <div class="scrollable">
                            <YSongsTable class="songs-table" :tracks="this.playlist" :showTrackCounter="false"
                                :showTrackAlbum="false" :showTrackDuration="false" :showTrackPopularity="false"
                                :showHeader="false" :resortable="false" :canSendPlaylist="false" :limit="500"
                                :id="'YPlaybar.vue'" />
                        </div>
                    </div>
                </YPanel>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { toogleLike, useApi } from '@/ncm/api';
import { mapState } from 'vuex';
import YSongsTable from './YSongsTable.vue';
import YPanel from './YPanel.vue';
import YProgressBar from './YProgressBar.vue';
import YProgressBarV from './YProgressBarV.vue';
import YTextBanner from './YTextBanner.vue';

export default {
    name: 'YPlaybar',
    components: {
        YSongsTable,
        YPanel,
        YProgressBar,
        YProgressBarV,
        YTextBanner,
    },
    props: {
        type: {
            type: String,
            default: 'default',
        },
    },
    emits: [
        'close-panel',
        'open-panel',
    ],
    data() {
        return {
            qualityGroup: [
                {
                    name: 'jymaster',
                    display: '超清母带(Master)',
                    id: 0,
                    desc: '还原音频细节，192kHz/24bit',
                    available: false,
                    size: '',
                },
                {
                    name: 'sky',
                    display: '沉浸环绕声(Surround Audio)',
                    id: 1,
                    desc: '沉浸式体验，最高5.1声道',
                    available: false,
                    size: '',
                },
                {
                    name: 'jyeffect',
                    display: '高清环绕声(Spatial Audio)',
                    id: 2,
                    desc: '环绕声体验，声音听感增强，96kHz/24bit',
                    available: false,
                    size: '',
                },
                {
                    name: 'hires',
                    display: '高解析度无损(Hi-Res)',
                    id: 3,
                    desc: '更饱满清晰的高解析度音质，最高192kHz/24bit',
                    available: false,
                    size: '',
                },
                {
                    name: 'lossless',
                    display: '无损(SQ)',
                    id: 4,
                    desc: '高保真无损音质，最高48kHz/16bit',
                    available: false,
                    size: '',
                },
                {
                    name: 'exhigh',
                    display: '极高(HQ)',
                    id: 5,
                    desc: '近CD品质的细节体验，最高320kbps',
                    available: false,
                    size: '',
                },
                {
                    name: 'standard',
                    display: '标准',
                    id: 7,
                    desc: '128kbps',
                    available: false,
                    size: '',
                }
            ],
            showButton: false,
            playlist: [],
            playState: 'pause',
            currentTrack: null,
            currentTrackComment: '0',
            playMode: 'order',
            duration: 0,
            currentTime: 0,
            progress: 0,
            progressInterval: null,
            volume: 0,
            qualityDisplay: '标准',
        }
    },
    watch: {
        volume() {
            this.player.volume = this.volume;
        }
    },
    computed: {
        ...mapState({
            player: state => state.player,
            login: state => state.login,
            setting: state => state.setting,
        }),
        likelist() {
            return this.login.likelist ?? [];
        },
        currentTrackName() {
            return this.currentTrack?.name;
        },
        currentTrackCover() {
            return this.currentTrack?.al.picUrl;
        },
        currentTrackArtists() {
            return this.currentTrack?.ar;
        },
    },
    methods: {
        setAudioProgress(progress) {
            this.player.progress = progress;
        },
        // 格式化时间
        formatDuration(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        },
        // 切换喜欢状态
        async _toogleLike(status) {
            if (!this.player.currentTrack) {
                return;
            }
            console.log('toogleLike');
            console.log('status:', status);
            await toogleLike(this.player.currentTrack.id, status);
            if (this.login.status) {
                this.login.reloadLikelist();
            }
        },
        // 切换播放状态
        tooglePlayState() {
            this.player.tooglePlayState();
        },
        // 下一首
        async goTo(direction) {
            let forward = direction === 'forward' ? true : false;
            console.log(forward ? 'next' : 'previous');
            forward ? this.player.next() : this.player.previous();
        },
        tooglePlayMode(mode) {
            this.player.mode = mode;
            this.setting.play.mode = mode;
        },
        async playTrack(track) {
            await this.player.playTrack(track);
        },
        addTrackToPlaylist(track) {
            this.player.addTrack(track);
        },
        handleArtistClick(artistId) {
            console.log('Artist ID:', artistId);
            this.$router.push({ path: '/artist/' + artistId });
        },
        updateVolumeInSetting() {
            this.setting.play.volume = this.volume;
        },
        setQuality(quality) {
            console.log('setQuality:', quality);
            this.player.quality = quality;
            this.setting.play.quality = quality;
            this.$refs.quality_panel.tooglePanel();
        },
        setShowButton() {
            if (this.player.currentTrack) {
                this.showButton = true;
            }
        },
        async setCommentCount() {
            await useApi(`/comment/music`, {
                id: this.currentTrack?.id ?? null,
                limit: 0,
            }).then(res => {
                let count = res.total;
                if (count < 1000) {
                    this.currentTrackComment = `${count}`;
                } else if (count >= 1000 && count < 10000) {
                    let num = Math.floor(count / 1000);
                    this.currentTrackComment = `${num}k+`;
                } else if (count >= 10000 && count < 100000) {
                    let num = Math.floor(count / 10000);
                    this.currentTrackComment = `${num}w+`
                } else if (count > 100000) {
                    let num = Math.floor(count / 100000);
                    this.currentTrackComment = `${num}0w+`
                }
            }).catch(err => {
                console.log(err);
            });
        },
    },
    async mounted() {
        if (this.login.status) {
            this.login.likelist.length === 0 ? this.login.reloadLikelist() : null;
        }
        this.player.volume = this.setting.play.volume;
        this.tooglePlayMode(this.setting.play.mode);
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                let avQuality = this.player.availableQuality;
                this.qualityGroup.forEach((quality) => {
                    // 清空可用数据
                    quality.available = false;
                    quality.size = '';
                    avQuality.forEach((avItem) => {
                        if (quality.name === avItem.name) {
                            quality.available = true;
                            quality.size = avItem.size;
                        }
                    });
                });
            },
            type: 'trackReady',
        })
        this.playlist = this.player.playlist;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.playlist = this.player.playlist;
            },
            type: 'playlist',
        })
        this.playState = this.player.playState;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.playState = this.player.playState;
            },
            type: 'playState',
        })
        this.currentTrack = this.player.currentTrack;
        this.setCommentCount();
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: async () => {
                this.currentTrack = this.player.currentTrack;
                await this.setCommentCount();
            },
            type: 'track',
        })
        this.currentTime = this.player.currentTime;
        this.duration = this.player.duration;
        this.progress = this.player.progress;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.duration = this.player.duration;
                this.currentTime = this.player.currentTime;
                this.progress = this.player.progress;
            },
            type: 'time',
        })
        this.playMode = this.player.mode;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.playMode = this.player.mode;
            },
            type: 'mode',
        })
        this.volume = this.player.volume;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.volume = this.player.volume;
            },
            type: 'volume',
        })
        this.qualityDisplay = this.player.qualityDisplay;
        this.player.Subscribe({
            id: 'YPlaybar' + `${this.type}`,
            func: () => {
                this.qualityDisplay = this.player.qualityDisplay;
            },
            type: 'quality',
        })
    },
    beforeUnmount() {
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'trackReady',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'playlist',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'playState',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'track',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'time',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'mode',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'volume',
        })
        this.player.UnSubscribe({
            id: 'YPlaybar' + `${this.type}`,
            type: 'quality',
        })
    },
}

</script>

<style lang="scss" scoped>
.big-progress {
    position: absolute;
    width: 100%;
    bottom: 75px;
}

.playbar {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    user-select: none;

    .img {
        user-select: none;
        opacity: 0.9;
        -webkit-user-drag: none;
    }

    .align-left {
        display: flex;
        align-items: center;
        width: calc(50vw - 220px);
        height: 100%;

        .play-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 10px;
            width: 100%;
            height: 100%;

            .play-info-left {
                display: flex;
                align-items: center;
                margin-right: 10px;
                overflow: hidden;
                position: relative;

                .img-cover {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                    margin-left: 15px;
                    border-radius: 5px;
                }

                .open-panel {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    opacity: 0;
                    transition: all 0.2s ease;

                    &:hover {
                        opacity: 1;
                    }

                    .open-panel-overlay {
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 5px;
                        left: 15px;
                    }

                    .img-open-panel {
                        position: absolute;
                        width: 30px;
                        height: 30px;
                        left: 10px;
                        top: 10px;
                        cursor: pointer;
                    }
                }

                .play-info-text {
                    flex-direction: column;
                    overflow: hidden;

                    .play-info-text-title {
                        text-align: left;
                        align-items: flex-start;
                        position: relative;
                        height: 20px;
                        /* overflow: hidden; */
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 100%;
                    }

                    .play-info-text-artist {
                        text-align: left;
                        align-items: flex-start;
                        font-size: 14px;
                        margin-top: 5px;
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;

                        .artist-button {
                            cursor: pointer;
                        }
                    }
                }
            }

            .play-info-right {
                display: flex;
                align-items: center;


                .close-button {
                    padding: 10px 10px 5px 10px;
                    background-color: rgba(255, 255, 255, .05);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, .1);
                    cursor: pointer;
                    margin: 0 20px 0 20px;

                    .img-close-panel {
                        width: 16px;
                        height: 16px;
                    }
                }

                .play-info-ico {
                    width: 22px;
                    height: 22px;
                    cursor: pointer;
                    opacity: .6;

                    &:hover {
                        opacity: 1;
                    }
                }

                .img-subscribe {
                    margin-right: 10px;
                }

                .img-download {
                    margin-right: 10px;
                }

                .play-info-time {
                    margin-left: 15px;
                    font-size: 13px;
                }

                .song-comment {
                    display: flex;
                    align-items: center;
                    position: relative;
                    opacity: .6;

                    &:hover {
                        opacity: 1;
                    }

                    .img-comment {
                        margin-right: 10px;
                        opacity: 1;
                    }

                    .song-comment-num {
                        position: absolute;
                        left: 12px;
                        top: -5px;
                        font-size: 10px;
                        z-index: 1;
                        padding: 0px 0px 2px 2px;
                        // background-color: rgb(45, 45, 55);
                    }
                }
            }
        }
    }

    .align-center {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);

        .buttons {
            display: flex;
            align-items: center;

            .button {
                margin: 0 10px;
                cursor: pointer;
                background-color: transparent;
                border: none;

            }

            .like-button {
                .img-like {
                    width: 22px;
                    height: 22px;
                }
            }

            .previous-button {
                .img-previous {
                    width: 18px;
                    height: 18px;
                }
            }

            .play-button {
                display: flex;
                width: 40px;
                height: 40px;
                background-color: rgb(254, 60, 90);
                align-items: center;
                justify-content: center;
                border-radius: 100%;
                overflow: hidden;

                .img-play {
                    width: 16px;
                    height: 16px;
                    padding-left: 3px;
                }

                .img-pause {
                    width: 16px;
                    height: 16px;
                }
            }

            .next-button {
                .img-next {
                    width: 18px;
                    height: 18px;
                }
            }

            .playMode-button {
                display: flex;
                width: 22px;
                height: 22px;
                align-items: center;
                justify-content: center;
                margin-bottom: 3px;

            }

            .img-order {
                width: 20px;
                height: 20px;
            }

            .img-listloop {
                width: 22px;
                height: 22px;
            }

            .img-random {
                width: 18px;
                height: 18px;
            }

            .img-loop {
                width: 22px;
                height: 22px;
            }

            .playMode-switcher {
                display: flex;
                position: absolute;
                width: 90px;
                height: 190px;
                transform: translate(calc(-100% + 35px), calc(-100% - 20px));
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: rgb(55, 55, 65);
                border-radius: 5px;
                padding: 10px;
                box-shadow: 2px -2px 10px #111;

                .playMode-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 30px;
                    cursor: pointer;
                    color: var(--font-color-high);
                    font-size: 15px;
                    padding: 10px 0px;
                    margin: 0px;

                    &:not(:last-child) {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .playMode-img {
                        margin-right: 5px;
                    }
                }
            }
        }

        .progress {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 4px;
            background-color: transparent;

            .time {
                font-size: 12px;
                margin: 0 8px;
                opacity: .4;
            }
        }
    }

    .align-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: calc(50vw - 220px);
        height: 100%;
        margin-right: 20px;

        .buttons {
            display: flex;
            align-items: center;

            .quality-button {
                position: relative;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                margin-right: 20px;
                border: 1.5px solid rgba(255, 255, 255, 0.4);
                padding: 3px 6px;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
            }

            .quality-panel {
                position: absolute;
                display: flex;
                flex-direction: column;
                width: 321px;
                background-color: rgb(55, 55, 65);
                border-radius: 5px;
                transform: translate(calc(-100% - 20px), calc(-100% - 25px));
                text-align: left;
                padding-top: 15px;
                padding-bottom: 10px;

                .quality-title {
                    font-size: 17px;
                    text-align: left;
                    font-weight: bold;
                    padding: 0px 0px 10px 15px;
                }

                .quality-switcher {
                    display: flex;
                    flex-direction: column;

                    .quality-item {
                        display: flex;
                        flex-direction: column;
                        text-align: left;
                        height: 50px;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 15px;
                        padding-left: 15px;

                        &:hover {
                            background-color: rgba(255, 255, 255, 0.1);
                        }

                        .quality-item-title {
                            font-size: 15px;
                            width: 100%;
                            text-align: left;
                        }

                        .quality-item-desc {
                            font-size: 13px;
                            width: 100%;
                            text-align: left;
                        }
                    }
                }
            }

            .volume-container {
                position: absolute;
                display: flex;
                flex-direction: column;
                width: 20px;
                height: 135px;
                align-items: center;
                justify-content: top;
                background-color: rgb(52, 52, 61);
                border-radius: 5px;
                padding: 10px 10px 20px 10px;
                transform: translate(-100%, calc(-100% - 20px));

                .volume-text {
                    position: absolute;
                    font-size: 13px;
                    bottom: 5px;
                }
            }

            .playlist-container {
                position: absolute;
                background-color: rgb(44, 45, 55);
                display: flex;
                flex-direction: column;
                border-radius: 5px;
                padding: 10px;
                justify-content: flex-start;
                transform: translate3d(calc(-100%), calc(-100% - 65px), 0);
                width: calc(321px + 43px);
                height: calc(100vh - 230px);
                box-shadow: -1px -1px 10px #111;

                .playlist-title {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px;
                    margin-bottom: 4px;
                    padding-bottom: 6px;

                    .title-left {
                        display: flex;
                        flex-direction: row;
                        font-size: 17px;
                        text-align: left;
                        font-weight: bold;
                    }
                }

                .playlist-header {
                    display: flex;
                    font-size: 14px;
                    flex-direction: row;
                    padding: 0px 25px 10px 0px;
                    margin-right: 10px;
                    margin-left: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    justify-content: space-between;
                }
            }
        }
    }
}

.scrollable {
    display: block;
    width: 100%;
    padding-right: 5px;
    overflow-y: auto;
    user-select: none;
    -webkit-user-drag: none;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 6px;
    }

    &:hover::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
}
</style>