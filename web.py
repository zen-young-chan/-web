#!/usr/bin/env python
# coding=utf-8

import tornado.web
from tornado import gen


class WebHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self, page):
        db = self.settings['db']
        herf = self.request.path
        i = int(herf.split("/")[2])
        ind = range((i-1)*5+1,i*5+1)
        alb = []
        cur = db['web'].find({},skip=(i-1)*5, limit=5).sort([("_id", -1)])
        for i in (yield cur.to_list(length=5)):
            alb.append(i)
        alb.append(len(alb))
        self.render("web.html", back=alb, ind=ind, pagenum="6")

class WebinfoHandler(tornado.web.RequestHandler):    
    @gen.coroutine  
    def get(self, page):
        db = self.settings['db']
        herfi = self.request.path
        i = str(herfi.split("/")[3])
        cur = db['web'].find({'_id': i})
        yield cur.fetch_next
        back = cur.next_object()
        self.render("webinfo.html", ifon=back, dress=back["photolink"])












# ## MongoDB pymongo ##
# from methods.readdb import loadface,loadinfo

# class WebHandler(tornado.web.RequestHandler):
#     def get(self, page):
#         herf = self.request.uri
#         i = int(herf.split("/")[2])
#         alb = loadface("web", i)
#         # pagenum = len(albumlist)/5
#         self.render("web.html", back=alb, ind=range((i-1)*5+1,i*5+1), pagenum=6)

# class WebinfoHandler(tornado.web.RequestHandler):    
#     def get(self, page):
#         herfi = self.request.uri
#         i = int(herfi.split("/")[3])
#         back =( x for x in loadinfo("web" ,i) )
#         bb = back.next()["photolink"]
#         self.render("webinfo.html", ifon=bb, dress=bb["photolink"])

