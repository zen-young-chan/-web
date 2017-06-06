#!/usr/bin/env python
# coding=utf-8

import tornado.web

class AboutHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("about.html")