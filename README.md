<h1 align="center"> 
    XCMusic
</h1>
<p align="center">
    第三方网易云音乐客户端
</p>
<div align="center">
	<img src="./src/assets/logo.svg" style="width:300px;">
</div>

访问DEMO: [xc-music.vercel.app](https://xc-music.vercel.app/)


## 特性
- 使用Vue3+Electron开发
- 出于安全考虑，只支持手机扫码登录
- 与网易云音乐3.0类似的布局
- 可以使用媒体快捷键控制播放
- 可以在系统通知中控制播放
- 支持音量均衡功能
- 类手机端的专辑界面
- 背景颜色随显示内容改变
- 支持使用弹幕姬点歌。(需要在弹幕姬安装[DMPlugin_XCMusic](https://github.com/yiktllw/DMPlugin_XCMusic)插件)
- 支持查看和复制歌曲信息(歌曲id，歌曲链接)

## 待完成
- 评论
    - 点赞功能
    - 楼中楼功能
    - 时间排序功能完善
- 播放界面
    - 歌曲百科
    - 回忆坐标等
- 首页推荐
- 歌单
    - 滚动到顶部，定位到当前歌曲
    - 播放列表自动滚动到当前歌曲
    - 多选操作,使用ctrl,shift完成多选,拖拽排序
    - 下载歌曲，播放本地歌曲
    - 处理无版权歌曲
- 设置界面
- 系统
    - 通知
    - 开机自启动功能
    - 完善系统托盘功能
- 记忆窗口大小,保存关闭时的播放列表，保存播放的歌曲和播放进度
- 音乐云盘
- 选择不同主题
- 多语言

## 部署到vercel
1. fork此项目
2. 部署[yiktllw/NeteaseCloudMusicApi](https://github.com/yiktllw/NeteaseCloudMusicApi)
3. 新建vercel.json文件，写入:
```json
{
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "dist_electron" 
            }
        }
    ]
}
```
4. 导入到vercel，新增一个环境变量: `VUE_APP_API`，值为第二步部署的api地址。

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
请注意，本项目使用的NeteaseCloudMusicApi是修改过的[yiktllw/NeteaseCloudMusicApi](https://github.com/yiktllw/NeteaseCloudMusicApi)，所以需要在安装依赖后手动替换`/node_modules/NeteaseCloudMusicApi`

~~为什么不直接发布一个新包呢，因为我懒~~

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

## 截图

![image](https://github.com/user-attachments/assets/97cfc4f3-3dfa-4305-8476-076cf2b75b3a)

![image](https://github.com/user-attachments/assets/ab8c65c3-9ba6-4187-b3c0-1d7ee229171f)

![image](https://github.com/user-attachments/assets/c73aadfa-7106-4057-b1f2-d3de46843c9c)

![image](https://github.com/user-attachments/assets/b5830b60-7e2e-41b7-908b-422bfa9507d0)

![image](https://github.com/user-attachments/assets/018da082-53fe-4ee4-af47-0df249664481)

![image](https://github.com/user-attachments/assets/6deab329-c083-41e2-b913-735247fbe66d)

