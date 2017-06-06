#!/usr/bin/env python
# -*-coding:utf-8-*-

import tornado.web
import time
from tornado import gen
from methods import sendemail

class ContactHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("contact.html", feedback="")

    @gen.coroutine
    def post(self):
        db = self.settings['db']
        name = str(self.get_argument("username"))
        info = str(self.get_argument("contact_info"))
        essay = str(self.get_argument("talk"))
        print name, type(name)
        print info, type(info)
        print essay, type(essay)
        masg = 'Hi 孙佳:'+'<br>'+'   '+'我是'+name+','+essay+'<br>'+'姓名: '+name+'<br>'+'联系方式: '+info

        if (name!="")&(info!="")&(essay!=""):
            self.render("contact.html",feedback="感谢你的留言")
            sendemail.send_mail('xxxxx@163.com', 'password', ['收件人1 <xxx@qq.com>', '收件人2 <xxx@qq.com>'], 'artsunjia个人网站消息', masg, [])
            # send a email to SunJia
            id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
            sub = db["contact"].insert_one({"_id":id_, "name": name, "info": info, "essay": essay})
            result = yield sub
            print "uplaoded id: ", result.inserted_id
            
        elif (name!="")&(info!=""):
            self.render("contact.html",feedback="难道就不说些什么吗？")
            id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
            sub = db["contact"].insert_one({"_id":id_, "name": name, "info": info, "essay": essay})
            result = yield sub
            print "uplaoded id: ", result.inserted_id
            # send a email to SunJia 
        elif (info!=""):
               self.render("contact.html",feedback="留个名字，再提交嘛")
        elif (name!=""):
            self.render("contact.html",feedback="留个微信、QQ、电话或者邮箱，以便联系")
        else:
            self.render("contact.html",feedback="留下你的名字和联系方式，再提交嘛")





# import json
# from methods.db import cur
# # database = conn.cursor() 
# class ContactHandler(tornado.web.RequestHandler):
#     def get(self):
#         self.render("contact.html", feedback="")

#     @gen.coroutine
#     def post(self):
#         db = self.settings['db']
#         name = str(self.get_argument("username"))
#         info = str(self.get_argument("contact_info"))
#         essay = str(self.get_argument("talk"))
#         print name, type(name)
#         print info, type(info)
#         print essay, type(essay)

#         if (name!="")&(info!="")&(essay!=""):
#             self.render("contact.html",feedback="感谢你的留言")
#             # send a email to SunJia
#             id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
#             result = cur["contact"].insert_one({"_id":id_, "name": name, "info": info, "essay": essay})
#             print json.dumps((x for x in cur["contact"].find().sort("_id",pymongo.DESCENDING)).next(), sort_keys=True, indent=4)
#            # database.execute('insert into contact(name,info,essay) values("%s","%s","%s")'%(name,info,essay))
#            # conn.commit()
#            # database.execute('select * from contact where name="%s"'%name)
#            # userinfo = database.fetchall()        
            
#         elif (name!="")&(info!=""):
#             self.render("contact.html",feedback="难道就不说些什么吗？")
#             id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
#             result = cur["contact"].insert_one({"_id":id_, "name": name, "info": info, "essay": essay})
#             print json.dumps((x for x in cur["contact"].find().sort("_id",pymongo.DESCENDING)).next(), sort_keys=True, indent=4)
#             # send a email to SunJia 
#         elif (info!=""):
#                self.render("contact.html",feedback="留个名字，再提交嘛")
#         elif (name!=""):
#             self.render("contact.html",feedback="留个微信、QQ、电话或者邮箱，以便联系")
#         else:
#             self.render("contact.html",feedback="留下你的名字和联系方式，再提交嘛")

