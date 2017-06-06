#!/usr/bin/env python
# coding=utf-8

import tornado.web
from tornado import gen

class PaintHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self, page):
        db = self.settings['db']
        herf = self.request.path
        i = int(herf.split("/")[2])
        ind = range((i-1)*5+1,i*5+1)
        alb = []
        cur = db['painting'].find({},skip=(i-1)*5, limit=5).sort([("_id", -1)])
        for i in (yield cur.to_list(length=5)):
            alb.append(i)
        alb.append(len(alb))
        self.render("paint.html", back=alb, ind=ind, pagenum="6")

class PaintinfoHandler(tornado.web.RequestHandler):    
    @gen.coroutine  
    def get(self, page):
        db = self.settings['db']
        herfi = self.request.path
        i = str(herfi.split("/")[3])
        cur = db['painting'].find({'_id': i})
        yield cur.fetch_next
        back = cur.next_object()
        self.render("paintinfo.html", ifon=back, dress=back["photolink"])







# ## MongoDB pymongo ##
# from methods.readdb import loadface,loadinfo
# class PaintHandler(tornado.web.RequestHandler):
#     def get(self, page):
#         herf = self.request.uri
#         i = int(herf.split("/")[2])
#         alb = loadface("painting",i)
#         # pagenum = len(albumlist)/5
#         self.render("paint.html", back=alb, ind=range((i-1)*5+1,i*5+1), pagenum=6)

# class PaintinfoHandler(tornado.web.RequestHandler):    
#     def get(self, page):
#         herfi = self.request.uri
#         i = int(herfi.split("/")[3])
#         back =( x for x in loadinfo("painting" ,i) )
#         bb = back.next()
#         self.render("paintinfo.html", ifon=bb, dress=bb["photolink"])

