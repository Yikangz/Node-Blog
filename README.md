### 使用express+mongoDB 建一个多人聊天的blog

### 启动
* 安装mongoDB
* /config/app.json 配置本地mongoDB参数
* npm 安装 supervisor ,监听文件变化
* supervisor apimain.js 启动项目

### 对应文件及文件夹的说明
* /config 所有配置文件的文件夹,里面的文件是json的形式
* /func 所有封装好的方法
* /models 模型层处理业务方法
* /views 存放视图文件
* /routes 存放路由文件
* /public 存放静态文件，如样式、图片等
* /public/img 上传的头像到这个文件夹
* apimain.js 主文件
* package.json 存储项目名、描述、作者、依赖等等信息
