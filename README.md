<h1 align="center"> 
    XCMusic
</h1>
<p align="center">
    第三方网易云音乐客户端
</p>
<div align="center">
	<img src="./src/assets/logo.svg" style="width:300px;">
</div>

## 特性
- 使用Vue3+Electron开发
- 出于安全考虑，只支持手机扫码登录
- 与网易云音乐3.0类似的布局
- 可以使用媒体快捷键控制播放
- 可以在系统通知中控制播放
- 支持音量均衡功能
- 背景颜色随显示内容改变
- 支持使用弹幕姬点歌。(需要在弹幕姬安装[DMPlugin_XCMusic](https://github.com/yiktllw/DMPlugin_XCMusic)插件)
- 支持查看和复制歌曲信息(歌曲id，歌曲链接)

## 待完成
- 播放界面，歌词功能
- 歌曲百科，回忆坐标等
- 首页推荐
- 多选操作
- 拖拽排序
- 下载歌曲，播放本地歌曲
- 设置界面
- 应用内通知，系统通知
- 记忆窗口大小
- 保存关闭时的播放列表，保存播放的歌曲和播放进度
- 开机自启动功能
- 系统托盘功能
- 音乐云盘
- 处理无版权歌曲
- 选择不同主题
- 多语言

## 配置开发环境
安装依赖
```
npm install
```
运行Electron程序
```
npm run electron:serve
```
编译为win32程序
```
npm run electron:build
```

## 灵感来源

- 网易云音乐API: [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [网易云音乐3.0](https://music.163.com)

## 关于
3. 
<div> </div>

2. 
<div> </div>

1. 图标来自于氢原子$ n=3, l=2, m=1 $时的波函数:

<div align="center">
	<img src="./src/assets/Hydrogen_n=3_l=2_m=1.png" style="width:400px;">
</div>