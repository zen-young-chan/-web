# Artsunjia 摄影师个人网站项目
## Tornado + MongoDB + Nginx ,异步读写数据库
##### [孙佳个人网站](artsunjia.com)

### 支持库

#### tornado
> pip install tornado

#### pymongo 
> pip install pymongo

#### motor 
> pip install motor

### pillow
> pip install pillow

### 目录
|
|--server
|--application
|--url
|--handlers          //每个网页的handler, 使用 Motor 实现异步读写MongoDB
|  |--photo
|  |--paint
|  |--web
|  ...
|
|--methods          //读取数据库,发邮件等函数工具
|  |--sendemail
|  |--readdb        //使用MySQL的时候用, 后来用来mongodb,读写方便,都不需要另写函数了
|  |--db            //使用MySQL的时候用
|  ...
|
|--statics          //存放JS, CSS, 图片, 字体
|  |--js
|  |--Style
|  |--Image
|  ...
|
|--templates        //放网页html模板
|  ...
