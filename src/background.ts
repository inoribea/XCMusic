/*---------------------------------------------------------------*
 * YiktLLW .. 2025-03-21 .. Johannes Brahms
 * background.ts 为 Electron 主进程的入口文件
 * 已在该文件中实现的功能:
 * 1. 创建窗口
 * 2. 创建托盘
 * 3. 监听缩放比例消息
 * 4. 监听全屏和退出全屏
 * 5. 处理窗口隐藏和显示
 * 6. 处理托盘点击事件
 * 7. 监听退出事件
 * 8. 监听第二个实例
 * 9. 存储窗口的大小和位置
 * 10. 禁用 GPU 加速
 *---------------------------------------------------------------*/

"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  Tray,
  nativeImage,
  Menu,
  ipcMain,
  screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
import { startNeteaseMusicApi } from "@/electron/services";
import * as path from "path";
import Store from "electron-store";

// 设置磁盘缓存的最大大小
app.commandLine.appendSwitch("disk-cache-size", `${100 * 1024 * 1024}`);
// 设置媒体缓存的最大大小
app.commandLine.appendSwitch("media-cache-size", `${30 * 1024 * 1024}`);

interface WindowState {
  width: number;
  height: number;
}

interface AppStore {
  windowState: WindowState;
  disableGpu: boolean;
}

const store = new Store<AppStore>();
// 从 store 中获取窗口的大小和位置
const windowState = store.get("windowState", {
  width: 1177,
  height: 777,
});

// 是否禁用 GPU 加速
const disableGpu = store.get("disableGpu", false);
if (disableGpu) {
  app.disableHardwareAcceleration();
}
ipcMain.on("disable-gpu", () => {
  store.set("disableGpu", true);
});
ipcMain.on("enable-gpu", () => {
  store.set("disableGpu", false);
});

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
// if (process.env.NODE_ENV === "development") {
//   app.commandLine.appendSwitch("remote-debugging-port", "9222");
//   app.commandLine.appendSwitch("inspect", "9229");
// }
// app.commandLine.appendSwitch("--inspect=9229");

let win: BrowserWindow | null = null;
let tray: Tray | null = null;

// 检查是否已经有实例在运行
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果已经有实例在运行，则退出新的实例
  app.quit();
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    // transparent: true,
    // vibrancy: 'light',
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION === "true",
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // webviewTag: true,
      webSecurity: false, // 允许加载本地资源
      backgroundThrottling: false, // 禁止后台时限制性能
    },
    frame: false,
    icon: path.join(__dirname, "../src/assets/icons/icon.png"),
  });
  win.on("close", () => {
    if (!win) return;
    const bounds = win.getBounds();
    store.set("windowState", bounds);
  });
  win.on("hide", () => {
    if (!win) return;
    const bounds = win.getBounds();
    store.set("windowState", bounds);
  });
  win.menuBarVisible = false;

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  let requests = [createWindow(), startNeteaseMusicApi()];
  await Promise.all(requests).catch((err) => {
    console.error(err);
  });

  // 监听缩放比例消息
  ipcMain.on("zoom", (event, zoomLevel) => {
    if (win) {
      win.webContents.setZoomFactor(zoomLevel);
    }
  });

  if (win) {
    // 监听全屏
    win.on("enter-full-screen", () => {
      if (!win) return;
      // 获取窗口的当前位置
      const windowBounds = win.getBounds();
      // 获取窗口所在的显示器
      const display = screen.getDisplayNearestPoint({
        x: windowBounds.x,
        y: windowBounds.y,
      });
      const { width, height } = display.workAreaSize; // 也可以用 display.size 获取整个显示器的尺寸

      win.webContents.send("fullscreen-window-size", { width, height });
    });

    // 监听退出全屏
    win.on("leave-full-screen", () => {
      if (!win) return;
      win.webContents.send("leave-fullscreen");
    });
  }

  // 不同环境下的图标路径
  const trayIcons = {
    win32: "icons/icon.ico",
    win32_dev: "../src/assets/icons/icon.ico",
    /** 暂无法使用 */
    darwin: "icons/icon.icns",
    /** 暂无法使用 */
    darwin_dev: "../src/assets/icons/icon.svg",
    /** 待测试 */
    linux: "icons/icon.svg",
    /** 待测试 */
    linux_dev: "../src/assets/icons/icon.svg",
  };

  // 获取当前环境的图标路径
  let is_dev: "_dev" | "" =
    process.env.NODE_ENV === "development" ? "_dev" : "";
  const icon_env: keyof typeof trayIcons = `${process.platform as "win32" | "darwin" | "linux"}${is_dev}`;

  // 从获取的图标路径创建图片
  const img = nativeImage.createFromPath(
    path.join(__dirname, trayIcons[icon_env]),
  );
  // 从图片创建托盘
  if (!img.isEmpty()) tray = new Tray(img);

  // 菜单模板
  let _menu = [
    {
      label: "显示主窗口",
      id: "show-window",
      click: () => {
        if (win) win.show();
      },
      enabled: win ? !win.show : true,
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ];
  let menu = Menu.buildFromTemplate(_menu);
  if (tray) {
    tray.setContextMenu(menu);
    tray.setToolTip("XCMusic");
  }

  if (win) {
    // 处理窗口隐藏
    win.on("hide", () => {
      if (!menu) return;
      const showWindowMenuItem = menu.getMenuItemById("show-window");
      if (showWindowMenuItem) {
        showWindowMenuItem.enabled = true;
      }
      if (tray) tray.setContextMenu(menu);
    });

    // 处理窗口显示
    win.on("show", () => {
      if (menu && menu.getMenuItemById("show-window")) {
        const showWindowMenuItem = menu.getMenuItemById("show-window");
        if (showWindowMenuItem) {
          showWindowMenuItem.enabled = false;
        }
      }
      if (tray) tray.setContextMenu(menu);
    });
  }

  // 处理托盘点击事件
  if (tray)
    tray.on("double-click", () => {
      if (!win) return;
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

/**
 * YiktLLW .. 2025-03-21 .. Johannes Brahms
 * 此处导入所有与ipcMain相关的事件
 */

import "@/utils/rendererEvents";
