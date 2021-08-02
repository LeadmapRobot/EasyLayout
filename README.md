# :house: 大屏可视化代码生成器(Dashboard layout code generator)



 >    通过拖拽布局的方式可视化搭建大屏页面并生成前端代码工程，为开发人员提供便捷。
 >
 >    Create dashboard by simple drag and drop, and transform dashboard to react projects.
 >
 >    ![main-interface.png](https://p5-tt.byteimg.com/origin/pgc-image/61fa2aca5a27444a88c53fe74fe12d44.png)
 >
 >    
 >
 >    在配置完成后，通过下载按钮，可获取到工程文件模板zip压缩包，保存了当前的布局配置信息，解压后即为一个标准react工程项目。
 >
 >    Click download(下载) to get project.
 >
 >    ![download-img.png](https://p26-tt.byteimg.com/origin/pgc-image/09077840389343bb8d4c7f26817c1780.png)
 >
 >    
 >
 >    下载的React项目概览
 >
 >    Download project overview.
 >
 >    
 >
 >    ![123.png](https://p5-tt.byteimg.com/origin/pgc-image/2f02684694164c568c0095ab76455163.png)
 >
 >    
 >
 >    备注:
 >
 >    1. 我们只制作开发了标题与容器两个仅有的拖拽源。
 >    2. 标题组件若拖拽至画布上，则为页面标题，若拖拽至已有的容器内，则为容器标题。
 >    3. 容器为空容器，不带任何内容。
 >
 >    Ps：
 >
 >    1. Only two components, title and container, are mode.
 >    2. The title put on canvas it was the title of the page, if in the container, it was the title of the container.
 >    3. The container is empty without any content.



## :rocket:安装(Install)

下载

Download

```sh
git clone https://github.com/LeadmapRobot/EasyLayout.git
```



界面安装(React)

React install

```bash
npm install
```
or
```bash
cnpm install
```



后台安装(python3)

Python3 install



依赖组件

Installing python3 modules

```
pip install flask
pip install click
pip install flask_cors
pip install flask_restful
```



## :bike:使用(Run)

界面启动

React run



本地

```sh
npm run dev
```
打包
```sh
npm run prod
```



后台启动

Python run

```
python3 manage.py runserver --host 192.168.1.2 --port 9021
```



下载的工程启动

Download project run



React项目工程

React project



本地

```sh
npm run dev
```

打包

```sh
npm run prod
```



## :symbols:配置模板
>    用户的每一步配置操作都会被记录下来并保存为一个json格式的数据模板，例如容器组件的定位、大小、背景配置、颜色配置等等。配置模板的设计方案分为容器配置模板和画布（页面）配置两大类；容器配置模板设计为一个数组，数组元素为所创建的容器组件配置对象;画布（页面）配置为一个对象,保存了所有画布上的配置信息。
```js
{
  //容器配置模板
  "componentTpl": [{...}],
  //画布页面配置模板
  "pageConfig": {...}
}
```
>我们把标题组件的配置信息分别放进了容器配置模板和画布配置模板的结构中，每个容器组件的配置包含了基本配置信息、样式信息和标题信息。同样的，画布配置与容器配置结构基本一致。容器配置的大致结构如下：

```js
{
  "config": {
    "type": "container",
    "No": 0,
    "top": "2.5%",
    "left": "6.25%",
    "title": "容器1",
    "bgImg": "containerImg1",
    ...
  },
  "style": {
    "top": "2.5%",
    "left": "6.25%",
    "width": "12.5%",
    "height": "20%",
    "backgroundColor": "rgba(160,74,74,0)",
    ...
  },
  "title": [{
    "id": "container0Title0",
    "title": "标题1",
    "style": {
    ...
    }
  }]
}
```



## :hammer_and_wrench:技术栈

* **React** 前端框架
* **redux Toolkit** 状态管理工具
* **antd** react组件库
* **axios** 前端请求库
* **react-dnd** 基于react的拖拽工具
* **immutability-helper** 复杂数据副本处理方案
* **webpack5** 模块打包器
* **Flask** 后台框架

