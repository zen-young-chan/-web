#!/usr/bin/env python
# coding=utf-8
"""
the url structure of website
"""
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

from handlers.photo import PhotoHandler, PhotoinfoHandler
from handlers.web import WebHandler, WebinfoHandler
from handlers.paint import PaintHandler, PaintinfoHandler
from handlers.about import AboutHandler
from handlers.contact import ContactHandler
from handlers.index import IndexHandler
from handlers.backstage import BackstageHandler
from handlers.login import LoginHandler
# from handlers.share import ShareHandler, ShareinfoHandler

url = [
    (r'/', IndexHandler),
    (r'/photo/(\d{0,2})', PhotoHandler),
    (r'/photo/album/(\w+)', PhotoinfoHandler),
    (r'/web/(\d{0,2})', WebHandler),
    (r'/web/album/(\w+)', WebinfoHandler),
    (r'/painting/(\d{0,2})', PaintHandler),
    (r'/painting/album/(\w+)', PaintinfoHandler),
    (r'/about', AboutHandler),
    (r'/contact', ContactHandler),
    (r'/index', IndexHandler),
    (r'/bs', BackstageHandler),
    (r'/login', LoginHandler),
    # (r'/share/(\d+)', ShareHandler),
    # (r'/share/ablum/(\d+)', ShareinfoHandler),
]

