# Artsunjia 摄影师个人网站项目
### Tornado + MongoDB + Nginx
##### [孙佳个人网站](artsunjia.com)

### 相关的库
#### [tornado](http://www.tornadoweb.org/en/stable/)
> pip install tornado
#### [pymongo](https://api.mongodb.com/python/current/) 
> pip install pymongo    //用于读写mongodb
#### [motor](http://motor.readthedocs.io/en/stable/) 
> pip install motor    //用于异步读写mongodb, 需要pymongo支持
#### [pillow](https://pypi.python.org/pypi/Pillow) 
> pip install pillow    //图片处理, 本项目主要用于图片压缩
### [MongoDB](https://docs.mongodb.com/manual/mongo/)
> 请查看[MongoDB官网教程](https://docs.mongodb.com/manual/installation/)
### [Nginx](http://nginx.org/en/docs/beginners_guide.html)
> 本项目使用[ Nginx 反向代理到 tornado] (http://nginx.org/en/docs/beginners_guide.html)

### 目录
```

├──server            //python 2.7.11
├──application
├──url
├──handlers          //每个网页的handler, 使用 Motor 实现异步读写MongoDB
├  ├──photo          //摄影作品网页
|  ├──paint          //绘画作品网页
|  ├──web            //网站设计作品网页
|  ...
|
├──methods          //读取数据库,发邮件等函数工具
|  ├──sendemail
|  ├──readdb        //使用MySQL的时候用, 后来用来mongodb,读写方便,都不需要另写函数了
|  ├──db            //使用MySQL的时候用
|  ...
|
├──statics          //存放JS, CSS, 图片, 字体
|  ├──js
|  ├──Style
|  ├──Image
|  ...
|
├──templates        //放网页html模板
|  ...
```
