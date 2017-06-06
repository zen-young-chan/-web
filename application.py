#!/usr/bin/env python
# coding=utf-8

from url import url

import tornado.web
import os

import motor.motor_tornado
from urllib import quote_plus

uri = "mongodb://%s:%s@%s/%s" % (quote_plus("username"), quote_plus("password"), "127.0.0.1:27017", "dbname")
client = motor.motor_tornado.MotorClient(uri)
db = client["dbname"]

settings = dict(
    template_path = os.path.join(os.path.dirname(__file__), "templates"),
    static_path = os.path.join(os.path.dirname(__file__), "statics"),
    cookie_secret = "DypnqfLKR02sGwmY5YZhLwfcJtzq+06YltmSqdrVqjA=", #import base64, uuid;base64.b64encode(uuid.uuid4().bytes+uuid.uuid4().bytes)
    xsrf_cookies = True,
    login_url = '/',
    db = db,
    debug=True
    )


application = tornado.web.Application(
    handlers = url,
    **settings
    )
