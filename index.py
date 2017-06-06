#!/usr/bin/env python
# coding=utf-8

import tornado.web
from tornado import gen

class IndexHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self):
        db = self.settings['db']
        photoindex = []
        cur = db['photo'].find({}, limit=3).sort([("_id", -1)])
        for i in (yield cur.to_list(length=3)):
            photoindex.append(i)
        
        paintindex = []
        cur = db['painting'].find({}, limit=3).sort([("_id", -1)])
        for i in (yield cur.to_list(length=3)):
            paintindex.append(i)
        
        webindex = []
        cur = db['web'].find({}, limit=3).sort([("_id", -1)])
        for i in (yield cur.to_list(length=3)):
            webindex.append(i)

        for i,v in enumerate(photoindex):
            print i , v['_id']


        # print photoindex
        # print paintindex
        # print webindex

        self.render("index.html", photoindex=photoindex, paintindex=paintindex, webindex=webindex)



      

      
    