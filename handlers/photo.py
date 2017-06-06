#!/usr/bin/env python
# -*- coding:utf-8 -*-

import tornado.web
from tornado import gen
# import json

class PhotoHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self, page):
        db = self.settings['db']
        herf = self.request.path
        i = int(herf.split("/")[2])
        ind = range((i-1)*5+1,i*5+1)
        alb = []
        cur = db['photo'].find({},skip=(i-1)*5, limit=5).sort([("_id", -1)])
        for i in (yield cur.to_list(length=5)):
            alb.append(i)
        alb.append(len(alb))
        # print json.dumps(alb[0], sort_keys=True, indent=4)
        self.render("photo1.html", back=alb, ind=ind, pagenum="10")

class PhotoinfoHandler(tornado.web.RequestHandler):  
    @gen.coroutine  
    def get(self, page):
        db = self.settings['db']
        herfi = self.request.path
        i = str(herfi.split("/")[3])
        cur = db['photo'].find({'_id':i})
        yield cur.fetch_next
        back = cur.next_object()
        self.render("photoinfo.html", ifon=back, dress=back["photolink"])

class ErrorHandler(tornado.web.RequestHandler):    #增加了一个专门用来显示错误的页面
    def get(self):                                        
        self.render("error.html")




# ## MongoDB pymongo ##
# from motheds.readdb import loadface, loadinfo
# class PhotoHandler(tornado.web.RequestHandler):
#     def get(self, page):
#         herf = self.request.uri
#         i = int(herf.split("/")[2])
#         alb = loadface("photo", i)
#         self.render("photo1.html", back=alb, ind=range((i-1)*5+1,i*5+1), pagenum=10)

# class PhotoinfoHandler(tornado.web.RequestHandler):    
#     def get(self, page):
#         herfi = self.request.uri
#         i = int(herfi.split("/")[3])
#         back =( x for x in loadinfo("photo" ,i) )
#         bb = back.next()
#         self.render("photoinfo.html", ifon=bb, dress=bb["photolink"])





# ## MySQL ##

# albumlist = loadface("photo")

