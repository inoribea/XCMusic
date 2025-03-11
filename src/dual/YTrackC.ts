import { Song } from "@/utils/api";
import { type ITrack } from "@/utils/tracks";

export class YTrackC implements ITrack {
  /*
   * 满足接口的空信息
   */
  tns = "";
  cd = 0;
  no = 0;
  reelIndex = 0;
  reelName = "";
  songInReelIndex = 0;
  dt = 0;
  pop = 0;
  playCount = 0;
  lyrics = [];
  h = null;
  l = null;
  sq = null;
  hr = null;
  jyeffect = null;
  sky = null;
  jymaster = null;
  originalIndex = 0;
  local = false;
  localPath = "";
  /*
   * 非空信息
   */
  _id: number;
  _name: string = "";
  _picUrl: string = "";
  _ar: Array<{
    // 歌手信息
    id: number; // 歌手 id，唯一标识
    name: string; // 歌手名
    tns: string; // 歌手别名
  }> = [];
  _al: {
    id: number;
    name: string;
    picUrl: string;
    tns: string;
  } = {
    id: 0,
    name: "",
    picUrl: "",
    tns: "",
  };
  _onTrackLoaded: Function;
  /**
   * 从歌曲id初始化歌曲信息
   * @param {number|string} id 歌曲id
   */
  constructor(id: number | null) {
    this._id = id ?? 0;
    this._onTrackLoaded = () => {};
    this.init();
  }
  /**
   * 初始化歌曲信息
   */
  async init() {
    if (!this._id) return;

    await Song.detail([this._id])
      .then((res) => {
        let tns = res[0].tns ? " (" + res[0].tns + ")" : "";
        this._name = res[0].name + tns;
        this._picUrl = res[0].al.picUrl;
        this._ar = res[0].ar;
        this._al = res[0].al;
        let trackTns = res[0].al.tns[0] ? " (" + res[0].al.tns + ")" : "";
        this._al.name = res[0].al.name + trackTns;
        this.onTrackLoaded();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get picUrl() {
    return this._picUrl;
  }
  get ar() {
    return this._ar;
  }
  get al() {
    return this._al;
  }
  get onTrackLoaded() {
    return this._onTrackLoaded;
  }
  set onTrackLoaded(fn) {
    if (typeof fn !== "function") {
      throw new Error("onTrackLoaded must be a function, but got " + typeof fn);
    }

    this._onTrackLoaded = fn;
  }
}
