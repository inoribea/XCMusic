<template>
    <div class="setting" ref="main">
        <div class="header">
            <div class="title font-color-main">{{ $t('settings') }}</div>
            <div class="switcher">
                <YHeader :switcher="switcher" @new-position="handleSwitcher" ref="header"></YHeader>
            </div>
        </div>
        <div class="main font-color-main">
            <div class="normal item" id="normal">
                <div class="normal-title item-title">
                    {{ $t('header.setting_view.normal') }}
                </div>
                <div class="normal-content item-content ">
                    <div class="content-item item-languige">
                        <div class="content-item-title">
                            {{ $t('setting_view.language') }}
                        </div>
                        <div class="content-item-content">
                            <input type="radio" id="zh" name="language" value="zh" v-model="language"
                                @change="switchToLanguage('zh')">
                            <label for="zh" @click="switchToLanguage('zh')">
                                简体中文
                            </label>
                            <input type="radio" id="en" name="language" value="en" v-model="language"
                                @change="switchToLanguage('en')">
                            <label for="en" @click="switchToLanguage('en')">
                                English
                            </label>
                        </div>
                    </div>
                    <div class="content-item item-theme ">
                        <div class="content-item-title item-theme-title ">
                            {{ $t('setting_view.theme') }}
                        </div>
                        <div class="content-item-content">
                            <select v-model="theme" @change="handleTheme">
                                <option v-for="item in themes" :key="item.value" :value="item.value">
                                    {{
                                        [
                                            'setting_view.theme_name.dark',
                                            'setting_view.theme_name.dark_high_contrast',
                                            'setting_view.theme_name.light',
                                            'setting_view.theme_name.light_high_contrast',
                                        ].includes(item.display) ?
                                            $t(item.display) : item.display
                                    }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="content-item item-zoom">
                        <div class="content-item-title item-zoom-title">
                            {{ $t('setting_view.zoom') }}
                        </div>
                        <div class="zoom-item">
                            <div class="item-zoom-content">
                                <input type="number" min="50" max="200" step="5" v-model="zoom">
                                <div class="zoom-apply" @click="handleZoom">
                                    {{ $t('setting_view.apply') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-item close-item">
                        <div class="content-item-title">
                            {{ $t('setting_view.close') }}
                        </div>
                        <div class="content-item-content item-content-close">
                            <div class="close-item1">
                                <input type="radio" name="close" value="minimize" v-model="closeBehavior"
                                    @change="setClose('minimize')">
                                <label @click="setClose('minimize')">
                                    {{ $t('setting_view.close_to_minimize') }}
                                </label>
                            </div>
                            <div class="close-item2">
                                <input type="radio" name="close" value="quit" v-model="closeBehavior"
                                    @change="setClose('quit')">
                                <label @click="setClose('quit')">
                                    {{ $t('setting_view.close_to_quit') }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="content-item-title">
                            {{ $t('setting_view.reload') }}
                        </div>
                        <div class="content-item-content">
                            <div class="reload-item" @click="reloadWindow">
                                {{ $t('setting_view.click_to_reload') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="play item" id="play">
                <div class="play-title item-title">
                    {{ $t('header.setting_view.play') }}
                </div>
                <div class="play-content item-content">
                    <div class="content-item item-play-volume_leveling">
                        <div class="content-item-title">
                            {{ $t('setting_view.play.volume_leveling') }}
                        </div>
                        <div class="content-item-content">
                            <input type="checkbox" id="volume_leveling" name="volume_leveling" v-model="volume_leveling"
                                @change="setVolumeLeveling(volume_leveling)">
                            <label for="volume_leveling" @click="setVolumeLeveling(volume_leveling)">
                                {{ $t('setting_view.play.volume_leveling_content') }}
                            </label>
                        </div>
                    </div>
                    <div class="content-item item-playui">
                        <div class="content-item-title">
                            {{ $t('setting_view.play.playui') }}
                        </div>
                        <div class="content-item-content">
                            <input type="checkbox" id="spectrum" name="spectrum" v-model="spectrum">
                            <label for="spectrum" @click="setSpectrum(spectrum)">
                                {{ $t('setting_view.play.show_spectrum') }}
                            </label>
                        </div>
                    </div>
                    <div class="content-item item-play-dbclick">
                        <div class="content-item-title">
                            {{ $t('setting_view.play.dbclick') }}
                        </div>
                        <div class="content-item-content item-play-dbclick-content">
                            <div class="dbclick-item1">
                                <input type="radio" id="play-dbclick" name="play" value="all" v-model="dbclick"
                                    @change="setDbClick('all')">
                                <label for="play-dbclick" @click="setDbClick('all')">
                                    {{ $t('setting_view.play.dbclick_playall') }}
                                </label>
                            </div>
                            <div class="dbclick-item2">
                                <input type="radio" id="play-click" name="play" value="single" v-model="dbclick"
                                    @change="setDbClick('single')">
                                <label for="play-click" @click="setDbClick('single')">
                                    {{ $t('setting_view.play.dbclick_playsingle') }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="content-item-title">
                            {{ $t('setting_view.play.device') }}
                        </div>
                        <div class="content-item-content">
                            <select v-model="selectedDevice" @change="selectAudioOutputDevice(selectedDevice)">
                                <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
                                    {{ device.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="download item" id="download">
                <div class="download-title item-title">
                    {{ $t('header.setting_view.download') }}
                </div>
                <div class="download-content item-content">
                    <div class="content-item item-download-quality">
                        <div class="content-item-title">
                            {{ $t('setting_view.download.quality') }}
                        </div>
                        <div class="content-item-content download-quality-item">
                            <select v-model="quality" @change="setQuality(($event.target as HTMLSelectElement).value)">
                                <option v-for="quality_item in qualities" :key="quality_item" :value="quality_item">
                                    {{ $t(`quality.${quality_item}`) }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="content-item item-download-path">
                        <div class="content-item-title">
                            {{ $t('setting_view.download.path') }}
                        </div>
                        <div class="content-item-content download-path-content">
                            <input type="text" v-model="downloadPath" />
                            <div class="select-file" @click="selectFile">
                                {{ $t('setting_view.download.select') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="about item" id="about">
                <div class="about-title item-title">
                    {{ $t('header.setting_view.about') }}
                </div>
                <div class="about-content item-content">
                    <div class="content-item item-about-version">
                        <div class="content-item-title">
                            {{ $t('setting_view.about.version') }}
                        </div>
                        <div class="content-item-content">
                            {{ version }}
                        </div>
                    </div>
                    <div class="content-item item-about-author">
                        <div class="content-item-title">
                            {{ $t('setting_view.about.author') }}
                        </div>
                        <div class="content-item-content">
                            YiktLLW
                        </div>
                    </div>
                    <div class="content-item item-about-readme">
                        <div class="content-item-title">
                            {{ $t('setting_view.about.readme') }}
                        </div>
                        <div class="content-item-content" @click="openReadme">
                            <div class="github-link">
                                README
                            </div>
                        </div>
                    </div>
                    <div class="content-item item-about-changelog">
                        <div class="content-item-title">
                            {{ $t('setting_view.about.changelog') }}
                        </div>
                        <div class="content-item-content" @click="openChangelog">
                            <div class="github-link">
                                CHANGELOG
                            </div>
                        </div>
                    </div>
                    <div class="content-item item-about-github">
                        <div class="content-item-title">
                            {{ $t('setting_view.about.source_code') }}
                        </div>
                        <div class="content-item-content">
                            <div class="github-link" @click="openGitRepo">
                                GitHub
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { YColor } from '@/utils/color';
import YHeader from '@/components/YHeader.vue';
import { Message } from '@/dual/YMessageC';
import { useStore } from 'vuex';
import { themes } from '@/utils/theme';
import packageJson from '../../package.json';
import { qualities } from '@/utils/setting';

export default defineComponent({
    name: 'YSettingView',
    components: {
        YHeader,
    },
    setup() {
        const store = useStore();
        const main = ref<HTMLElement | null>(null);
        const header = ref<typeof YHeader | null>(null);

        return {
            main,
            header,
            setting: store.state.setting,
            player: store.state.player,
        }
    },
    computed: {
        version() {
            return packageJson.version;
        }
    },
    watch: {
        spectrum(val) {
            this.setSpectrum(val);
        },
    },
    data() {
        return {
            switcher: [
                {
                    num: 0,
                    showNum: false,
                    position: 'normal',
                    display: 'header.setting_view.normal',
                },
                {
                    num: 0,
                    showNum: false,
                    position: 'play',
                    display: 'header.setting_view.play',
                },
                {
                    num: 0,
                    showNum: false,
                    position: 'download',
                    display: 'header.setting_view.download',
                },
                {
                    num: 0,
                    showNum: false,
                    position: 'about',
                    display: 'header.setting_view.about',
                }
            ],
            language: 'zh',
            themes: themes,
            theme: 'dark',
            zoom: 100,
            closeBehavior: 'minimize',
            volume_leveling: false,
            spectrum: false,
            dbclick: 'all',
            downloadPath: '',
            quality: 'standard',
            qualities: qualities,
            devices: [] as MediaDeviceInfo[],
            selectedDevice: '' as any,
        }
    },
    methods: {
        handleSwitcher(position: string) {
            const scroll = document.querySelector(`#yscroll-display-area`);
            const dom = this.main?.querySelector(`#${position}`);
            const firstDom = this.main?.querySelector('#normal');
            if (!dom || !scroll || !firstDom) return;
            const scrollTop = (dom as HTMLElement).offsetTop - (firstDom as HTMLElement).offsetTop;
            scroll.scrollTo({ top: scrollTop, behavior: 'smooth' });

        },
        handleTheme(e: any) {
            this.switchToTheme(e.target.value);
        },
        switchToTheme(theme: string) {
            this.theme = theme;
            document.body.className = `theme-${this.theme}`;
            this.setting.display.theme = this.theme;
        },
        setClose(behavior: 'minimize' | 'quit') {
            this.closeBehavior = behavior;
            this.setting.titleBar.closeButton = behavior;
        },
        handleZoom() {
            try {
                this.setting.display.zoom = this.zoom / 100;
                if (window.electron?.isElectron) {
                    Message.post('success', this.$t('message.setting_view.zoom_applied'));
                } else {
                    Message.post('info', this.$t('message.setting_view.only_desktop'));
                }
            } catch (error) {
                Message.post('error', this.$t('message.setting_view.zoom_range_50_200'));
            }
        },
        switchToLanguage(language: 'zh' | 'en') {
            this.language = language;
            this.setting.display.language = language;
            this.$i18n.locale = this.language;
        },
        setDbClick(behavior: 'all' | 'single') {
            this.dbclick = behavior;
            this.setting.play.dbclick = behavior;
        },
        setVolumeLeveling(bool: boolean) {
            this.volume_leveling = bool;
            this.setting.play.volume_leveling = this.volume_leveling;
            this.player.volumeLeveling = bool;
        },
        setSpectrum(bool: boolean) {
            this.spectrum = bool;
            if (this.setting.playui.spectrum !== bool) {
                this.setting.playui.spectrum = this.spectrum;
                if (bool) {
                    Message.post('info', 'setting_view.work_after_reload_window', true);
                }
            }
        },
        async selectFile() {
            if (window.electron?.isElectron) {
                const path = await window.electron.ipcRenderer.invoke('select-folder');
                console.log(path);
                if (path && typeof path === 'string') {
                    this.setting.download.path = path;
                    this.downloadPath = this.setting.download.path;
                }
            } else {
                Message.post('info', this.$t('message.setting_view.download.only_desktop'));
            }
        },
        setQuality(quality: string) {
            this.quality = quality;
            this.setting.download.quality = quality;
        },
        openGitRepo() {
            if (!window.electron?.isElectron) {
                return;
            }
            window.electron.shell.openExternal('https://github.com/yiktllw/XCMusic');
        },
        openReadme() {
            if (!window.electron?.isElectron) {
                return;
            }
            this.$router.push({ path: '/markdown/README' });
        },
        openChangelog() {
            if (!window.electron?.isElectron) {
                return;
            }
            this.$router.push({ path: '/markdown/CHANGELOG' });
        },
        async getDevices() {
            // window.test = this.player;
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                this.devices = devices.filter(device => device.kind === 'audiooutput');
                this.selectedDevice = this.player.device;
                // console.log('Audio device Ids:', this.devices.map(device => device.deviceId));

            } catch (err) {
                console.error('Error fetching audio devices:', err);
            }
        },
        async selectAudioOutputDevice(deviceId: string) {
            const audioElement = this.player._audio;
            if (!audioElement) return;

            try {
                // 检查是否支持 setSinkId 方法
                if (typeof audioElement.setSinkId === 'function') {
                    await this.player.setDevice(deviceId).then(() => {
                        this.selectedDevice = deviceId;
                        this.setting.play.device = deviceId;
                    });
                    // this.selectedDevice = audioElement.sinkId;
                    console.log(`Audio output set to device: ${deviceId}`);
                } else {
                    console.error('Browser does not support setSinkId.');
                }
            } catch (err) {
                console.error('Error setting audio output device:', err);
            }
        },
        reloadWindow() {
            window.location.reload();
        }
    },
    mounted() {
        YColor.setBackgroundColorTheme();
        this.theme = this.setting.display.theme;
        this.zoom = this.setting.display.zoom * 100;
        this.language = this.setting.display.language;
        this.closeBehavior = this.setting.titleBar.closeButton;
        this.volume_leveling = this.setting.play.volume_leveling;
        this.spectrum = this.setting.playui.spectrum;
        this.dbclick = this.setting.play.dbclick;
        this.downloadPath = this.setting.download.path;
        this.quality = this.setting.download.quality;
        this.getDevices();
    },
})
</script>

<style lang="scss" scoped>
.setting {
    display: flex;
    width: inherit;
    padding: 0 10px 10px 10px;

    .header {
        display: flex;
        flex-direction: column;
        width: calc(100% - 40px);
        text-align: left;
        position: absolute;
        background-color: var(--background-color);

        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0 10px 20px;
        }

        .switcher {
            --font-size-header: 17px;
            --font-weight-header: bold;
        }
    }

    .main {
        display: flex;
        flex-direction: column;
        margin-top: 120px;

        .item {
            display: flex;
            align-items: first baseline;
            flex-direction: row;
            white-space: nowrap;

            .item-title {
                font-size: 17px;
                font-weight: bold;
                margin: 10px 0 10px 23px;
                text-align: left;
                min-width: 86.42px;
            }

            .item-content {
                display: flex;
                flex-direction: column;
                margin: 10px 43.21px 10px 23px;

                .download-path-content {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .select-file {
                        cursor: pointer;
                        margin-left: 10px;
                        color: var(--font-color-high);

                        &:hover {
                            color: var(--font-color-main);
                        }
                    }

                    input {
                        width: 210px;
                        height: 30px;
                        border: 1px solid rgba(var(--foreground-color-rgb), $alpha: 0.3);
                        background-color: transparent;
                        color: var(--font-color-high);
                        font-size: 16px;
                        border-radius: 5px;
                        padding: 0 10px;
                        margin-right: 10px;

                        &:focus {
                            outline: none;
                        }

                    }
                }

                .content-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    align-items: first baseline;
                    color: var(--font-color-high);
                    margin-bottom: 10px;

                    .content-item-title {
                        font-weight: bold;
                        min-width: 100px;
                        text-align: left;
                    }

                    .content-item-content {

                        .reload-item {
                            cursor: pointer;
                        }

                        select {
                            // width: 210px;
                            padding: 2px 2px !important;
                            border: 1px solid rgba(var(--foreground-color-rgb), $alpha: 0.3);
                            background-color: transparent;
                            color: var(--font-color-high);
                            font-size: 16px;
                            border-radius: 5px;
                            padding: 0 10px;
                            margin-right: 10px;
                            cursor: pointer;

                            option {
                                color: var(--font-color-high);
                                background-color: var(--background-color);
                            }

                            &:focus {
                                outline: none;
                            }
                        }

                        .github-link {
                            cursor: pointer;
                            color: var(--font-color-high);
                            text-decoration: underline;

                            &:hover {
                                color: var(--font-color-main);
                            }
                        }

                        input[type="radio"] {
                            cursor: pointer;
                        }

                        label {
                            cursor: pointer;
                        }
                    }

                    .download-quality-item {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: first baseline;
                        line-height: 32.1px;

                        div {
                            margin-right: 10px;
                        }
                    }

                    .item-content-close,
                    .item-play-dbclick-content {
                        display: flex;
                        flex-direction: column;
                        line-height: 32.1px;
                        align-items: start;
                    }
                }

                .item-theme {
                    .item-theme-title {
                        font-weight: bold;
                    }
                }

                .item-zoom {
                    .item-zoom-title {
                        font-weight: bold;
                    }

                    .zoom-item {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: first baseline;
                        line-height: 32.1px;

                        .item-zoom-content {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-right: 10px;
                            cursor: pointer;

                            input[type="number"] {
                                display: flex;
                                align-items: center;
                                width: 50px;
                                background-color: transparent;
                                border: 1px solid rgba(var(--foreground-color-rgb), $alpha: 0.3);
                                color: var(--font-color-high);
                                border-radius: 5px;

                                &:focus {
                                    outline: none;
                                }
                            }

                            .zoom-apply {
                                cursor: pointer;
                                margin-left: 10px;
                                color: var(--font-color-high);

                                &:hover {
                                    color: var(--font-color-main);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>