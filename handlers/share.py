#!/usr/bin/env python
# coding=utf-8

import tornado.web
from methods.readdb import loadface,loadinfo,loadintro

albumlist = loadface("share")
introlist = loadintro("share")

class ShareHandler(tornado.web.RequestHandler):
    def get(self,pagee):
        herf = self.request.uri
        i = int(herf.split("/")[2])
        abl = albumlist[(i-1)*4:i*4]
        pagenum = len(albumlist)/4
        itrl = introlist[(i-1)*2:i*2]
        self.render("share.html",ind=range((i-1)*4+1,i*4+1),pagenum=pagenum,itrl=itrl,abl=abl)

class ShareinfoHandler(tornado.web.RequestHandler):    
    def get(self,page):

        
        self.render("shareinfo.html")

