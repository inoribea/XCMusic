import { useApi } from "./api";

export class Tracks {
    _tracksMap: Map<any, any>;
    _tracks: any;
    /**
     * 初始化歌曲列表
     * @param {object} params 参数
     * @param {string} params.url 请求地址
     * @param {Array} params.tracks 歌曲列表
     * @param {object} params.params 额外参数
     */
    constructor({ url, tracks, params, }: { url: string; tracks: Array<any>; params?: any; }) {
        this._tracksMap = new Map();
        this._tracks = tracks.map((item, index) => {
            let resultTrack = {
                id: 0,
                name: '',
                tns: '',
                al: {
                    id: 0,
                    name: '',
                    picUrl: '',
                    tns: '',
                },
                ar: [
                    {
                        id: 0,
                        name: '',
                        tns: '',
                    },
                ],
                _picUrl: '',
                cd: 1,
                no: 1,
                reelName: null,
                reelIndex: 0,
                songInReelIndex: 0,
                dt: 0,
                pop: 0,
                playCount: 0,
                lyrics: [
                    '',
                ],
                h: null as any,
                l: null as any,
                sq: null as any,
                hr: null as any,
                jyeffect: null as any,
                sky: null as any,
                jymaster: null as any,
                originalIndex: null as any,
                local: false,
                localPath: '',
            }
            if (item !== null) {
                let track: any = null;
                if (url === '/user/record') {
                    track = item.song;
                } else if (url === '/cloudsearch?type=1' || url === '/cloudsearch?type=1006') {
                    track = item;
                } else if (url === '/artist/songs') {
                    track = item;
                    let index = params.albums.findIndex((album: any) => album.id === track.al.id);
                    if (index === -1) {
                        track.al.picUrl = require('@/assets/song.svg');
                    } else {
                        track.al.picUrl = params.albums[index].picUrl;
                    }
                } else if (url === '/api/v2/artist/songs') {
                    track = item;
                    track.tns = track.transNames;
                    track.al = {
                        id: track.album.id,
                        name: track.album.name,
                        picUrl: track.album.picUrl,
                        tns: '',
                    }
                    track.ar = track.artists.map((ar: any) => {
                        return {
                            id: ar.id,
                            name: ar.name,
                            tns: '',
                        }
                    });
                    track.pop = track.popularity;
                    track.dt = track.duration;
                } else if (url === '/api/album/v3/detail') {
                    track = item;
                    track.cd = parseInt(track.cd);
                    if (params.needIndex) {
                        resultTrack = {
                            ...resultTrack,
                            originalIndex: params.page ? (params.page - 1) * 500 + index : index,
                        }
                    }
                    if (params.reels) {
                        params.reels.forEach((reel: any, reelIndex: any) => {
                            reel.songList.forEach((song: any, songIndex: any) => {
                                if (song.songId == track.id) {
                                    track.reelName = song.songName;
                                    resultTrack.reelIndex = reelIndex;
                                    resultTrack.songInReelIndex = songIndex;
                                }
                            });
                        });
                    }
                } else if (url === '/playlist/track/all' || url === '/album') {
                    track = item;
                    if (params.needIndex) {
                        resultTrack = {
                            ...resultTrack,
                            originalIndex: params.page ? (params.page - 1) * 500 + index : index,
                        }
                    }
                    if (url === '/album' && params.alPicUrl) {
                        track.al.picUrl = params.alPicUrl;
                    }
                } else if (url === 'local') {
                    const path = item.path.replace(/\\/g, '/');
                    const validId = path
                        .replace(/\//, '_yikt_') // 替换开头的 '/' 为 '_yikt_'
                        .replace(/\s/g, '_space_') // 替换空格
                        .replace(/[^\w-._]/g, '_other_')
                        .replace(/\./g, '_') 
                    track = {
                        id: validId,
                        name: item.name,
                        al: {
                            id: validId,
                            name: item.album,
                            picUrl: '/src/assets/song.svg',
                        },
                        ar: [
                            {
                                id: validId,
                                name: item.artist,
                            },
                        ],
                        dt: Math.ceil(item.duration * 1000),
                        pop: 0,
                        localPath: item.path,
                    }
                }
                resultTrack.id = track.id;
                resultTrack.name = track.name;
                resultTrack.tns = track.tns ?? '';
                resultTrack.al.id = track.al.id;
                resultTrack.al.name = track.al.name;
                resultTrack.al.picUrl = track.al.picUrl;
                resultTrack.al.tns = track.al.tns ?? '';
                if (url !== 'local') {
                    resultTrack._picUrl = track.al.picUrl + '?param=80y80';
                } else {
                    resultTrack._picUrl = track.al.picUrl;
                }
                resultTrack.cd = track.cd ?? 1;
                resultTrack.no = track.no ?? 1;
                resultTrack.ar = track.ar.map((ar: any) => {
                    return {
                        id: ar.id,
                        name: ar.name,
                        tns: ar.tns ?? '',
                    }
                });
                resultTrack.dt = track.dt;
                resultTrack.pop = track.pop;
                resultTrack.h = track.h ? { size: track.h.size } : null;
                resultTrack.l = track.l ? { size: track.l.size } : null;
                resultTrack.sq = track.sq ? { size: track.sq.size } : null;
                resultTrack.hr = track.hr ? { size: track.hr.size } : null;
                if (url === '/cloudsearch?type=1006') {
                    resultTrack.lyrics = track.lyrics;
                } else if (url === '/user/record') {
                    resultTrack.playCount = item.playCount;
                } else if (url === 'local') {
                    resultTrack.local = true;
                }
                resultTrack.reelName = track.reelName ?? null;
                resultTrack.localPath = track.localPath ?? '';
            }

            // 将 resultTrack 放入 Map 中，使用 id 作为键
            this._tracksMap.set(resultTrack.id, resultTrack);

            return resultTrack;
        });
    }
    get tracks() {
        return this._tracks;
    }

    /**
     * 使用 id 获取单个 track
     * @param {number} id 要获取的 track 的 id
     * @returns {object|null} 返回对应 id 的 track 对象或 null
     */
    getTrackById(id: number): object | null {
        return this._tracksMap.get(id) || null;
    }
}

export class TrackIds {
    _ids: Array<number>;
    result: any[] = [];
    constructor(ids: Array<number>) {
        this._ids = ids;
    }
    async initData() {
        if (this._ids.length === 0) {
            return;
        }
        await useApi('/song/detail', {
            ids: this._ids.join(',')
        }).then(res => {
            this.result = res.songs.map((item: any) => {
                return {
                    ...item,
                    _picUrl: item.al.picUrl + '?param=80y80',
                }
            });
        }).catch(err => {
            console.error(err);
        });
    }
    get tracks() {
        return this.result;
    }
}

export class Track {
    _track: object;
    _url: string;
    _params: object;
    /**
     * 初始化歌曲信息
     * @param {object} params 参数
     * @param {string} params.url 请求地址
     * @param {object} params.track 歌曲信息
     * @param {object} params.params 额外参数
     */
    constructor({
        url = '/playlist/tracks/all',
        track = {},
        params = {
            type: 'local',
            path: 'C:/',
        },
    }: { url: string; track: object; params: any; }) {
        this._track = track;
        this._url = url;
        this._params = params;
        if (params.type === 'local') {
            // 
        }
    }
    get track() {
        return this._track;
    }
}
