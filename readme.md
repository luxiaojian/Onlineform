# 在线报表系统
## 在线体验DEMO: http://onlineform.duohuo.org/
## 在线视频使用教程: http://www.tudou.com/programs/view/mAu03OtggJI/
## 应用简介

[![Greenkeeper badge](https://badges.greenkeeper.io/luxiaojian/Onlineform.svg)](https://greenkeeper.io/)

![屏幕快照 2015-08-18 下午8.20.53](img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-08-18%20%E4%B8%8B%E5%8D%888.20.53.png)

> 使用MEAN架构实现的在线报表系统，单页应用（SPA），管理员可以在线发布报表和管理（审核，退回）填写好的报表，管理实验室，批量管理用户，普通用户在线填写报表，查看自己填写报表的审核情况。

## UI界面
![屏幕快照 2015-08-18 下午8.19.45](img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-08-18%20%E4%B8%8B%E5%8D%888.19.45.png)

**root用户添加报表页面**

![屏幕快照 2015-08-18 下午8.19.58](img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-08-18%20%E4%B8%8B%E5%8D%888.19.58.png)

**root用户审核报表页面**

![屏幕快照 2015-08-18 下午8.21.33](img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-08-18%20%E4%B8%8B%E5%8D%888.21.33.png)
**普通用户UI界面**

## 应用架构介绍
![屏幕快照 2015-08-19 上午12.26.05](img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-08-19%20%E4%B8%8A%E5%8D%8812.26.05.png)
  
整个应用的目录结构由两部分构成，目录`app`是客户端代码，也就算是`MVC`结构里面的视图（view）层，`server`目录是服务端代码，是model和controller层。  
## JS技术栈  
* AngularJS：前端MV*框架，构建前端架构，在前端构建分层。
* underscore.js: 通用的Object，Array和Function工具方法，前后端都可以用，这里我主要用在nodeJS后端。
* expressJs:nodeJS的web框架。
* sass:预处理css。
* gulp:前端自动化构建工具。
* async.js:js流程控制工具包，我用它来在node中实现一些同步操作。


