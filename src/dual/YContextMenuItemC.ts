/*---------------------------------------------------------------*
 * YiktLLW .. 2025-03-21 .. Johannes Brahms
 * YContextMenuItemC.ts 为YContextMenu组件配套的处理工具
 *---------------------------------------------------------------*/

import { type IPlaylist } from "@/utils/login";
import play_ from "@/assets/play_.svg";
import addtoplaylist from "@/assets/addtoplaylist.svg";
import subscribe from "@/assets/subscribe.svg";
import smalldownload from "@/assets/smalldownload.svg";
import comment from "@/assets/comment.svg";
import link from "@/assets/link.svg";
import info from "@/assets/info.svg";
import _delete from "@/assets/delete.svg";
import edit from "@/assets/edit.svg";

interface ICtxMenuItem {
  /** 显示的文字 */
  label: string;
  /** 作用 */
  role: string;
  /** 图标 */
  icon: string;
  /** 是否显示分隔符 */
  showSeparator: boolean;
  /** 是否显示此菜单项 */
  display: boolean;
}

export interface IMenuClick {
  role: string;
  target: any;
  /** 来自哪个歌单，如果不是自己创建的歌单，则为-1 */
  from: number;
}

export interface IPlaylistCtxData {
  /** 歌单ID */
  id: number;
  /** 事件x坐标 */
  x: number;
  /** 事件y坐标 */
  y: number;
  /** 触发菜单的来源 */
  from: "created-playlists" | "subscribed-playlists" | "searched-playlists";
  /** 侧边栏的歌单 */
  playlist: IPlaylist;
}

export class YContextMenuItemC implements ICtxMenuItem {
  _label: string;
  _role: string;
  _icon: string;
  _showSeparator: boolean;
  _display: boolean;
  constructor({
    label = "播放",
    role = "play",
    icon = "@/assets/play.png",
    showSeparator = false,
    display = false,
  }: ICtxMenuItem) {
    this._label = label;
    this._role = role;
    this._icon = icon;
    this._showSeparator = showSeparator;
    this._display = display;
  }
  get label() {
    return this._label;
  }
  set label(value) {
    if (typeof value === "string") {
      this._label = value;
    }
  }
  get role() {
    return this._role;
  }
  set role(value) {
    if (typeof value === "string") {
      this._role = value;
    }
  }
  get icon() {
    return this._icon;
  }
  set icon(value) {
    if (typeof value === "string") {
      this._icon = value;
    }
  }
  get showSeparator() {
    return this._showSeparator;
  }
  set showSeparator(value) {
    if (typeof value === "boolean") {
      this._showSeparator = value;
    }
  }
  get display() {
    return this._display;
  }
  set display(value) {
    if (typeof value === "boolean") {
      this._display = value;
    }
  }
}

export const songItems = [
  new YContextMenuItemC({
    label: "context.play",
    icon: play_,
    role: "song-play",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.nextplay",
    icon: addtoplaylist,
    role: "song-addtoplaylist",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.subscribe",
    icon: subscribe,
    role: "song-subscribe",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.download",
    icon: smalldownload,
    role: "song-download",
    showSeparator: true,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.view_comment",
    icon: comment,
    role: "song-comment",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.copy_link",
    icon: link,
    role: "song-copylink",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.info",
    icon: info,
    role: "song-infomation",
    showSeparator: true,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.delete_from_playlist",
    icon: _delete,
    role: "song-delete",
    showSeparator: false,
    display: false,
  }),
];

export const playlistItems = [
  new YContextMenuItemC({
    label: "context.playAll",
    icon: play_,
    role: "playlist-play",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.addToPlaylistAll",
    icon: addtoplaylist,
    role: "playlist-addtoplaylist",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.downloadAll",
    icon: smalldownload,
    role: "playlist-download",
    showSeparator: false,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.editPlaylist",
    icon: edit,
    role: "playlist-edit",
    showSeparator: true,
    display: true,
  }),
  new YContextMenuItemC({
    label: "context.delete_playlist",
    icon: _delete,
    role: "playlist-delete",
    showSeparator: false,
    display: false,
  }),
];
