#!/usr/bin/env python
# coding=utf-8

import tornado.web
from tornado import gen
import json

class LoginHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self):
        db = self.settings['db']
        usernames = db['users'].find()
        yield usernames.fetch_next
        one_user = usernames.next_object()["username"]
        self.render("login.html", user=one_user)

    @gen.coroutine  
    def post(self):
        db = self.settings['db'] 
        username = str(self.get_argument("username"))
        password = str(self.get_argument("password"))
        fd = db['users'].find({"username" : username})
        yield fd.fetch_next
        user_infos = fd.next_object()
        print json.dumps(user_infos, sort_keys=True, indent=4)
        if user_infos:
            db_pwd = user_infos["password"]
            if db_pwd == password:
                # self.write(username)
                self.set_current_user(username)
                self.redirect('/bs')
                
            else:
                user_infos = ((1L, username, u'Not Right', u'Null'),)
                self.render("user.html", users = user_infos)
                
        else:
            user_infos = ((1L, u'Not Right', u'Null', u'Null'),)
            self.render("user.html", users = user_infos)


    def set_current_user(self, user):
        if user:
            self.set_secure_cookie("user", tornado.escape.json_encode(user), expires_days=1)    #注意这里使用了tornado.escape.json_encode()方法
        else:
            self.clear_cookie("user")
       
    def get_current_user(self):
        return self.get_secure_cookie("user", max_age_days=2)





# from methods.db import cur
# class LoginHandler(tornado.web.RequestHandler):
#     def get(self):
#         usernames = (i for i in cur['users'].find())
#         one_user = usernames.next()["username"]
#         self.render("login.html", user=one_user)  
#     def post(self): 
#         username = self.get_argument("username")
#         password = self.get_argument("password")
#         user_infos = ( i for i in cur['users'].find({"username" : username}))
#         print user_infos

#         if user_infos:
#             db_pwd = user_infos.next()["password"]
#             print db_pwd
#             if db_pwd == password:
#                 self.set_current_user(username)
#                 # self.write(username)
#             else:
#                 self.set_current_user(username+'no_pd')
#                 # self.write(username+'nopd') #username+'no_pd'
#         else:
#             self.set_current_user("-1")
#             # self.write("-1")


#     def set_current_user(self, user):
#         if user:
#             self.set_secure_cookie("user", tornado.escape.json_encode(user))    #注意这里使用了tornado.escape.json_encode()方法
#         else:
#             self.clear_cookie("user")

# class ErrorHandler(BaseHandler):    #增加了一个专门用来显示错误的页面
#     def get(self):                                        
#         self.render("error.html")






#class IndexHandler(tornado.web.RequestHandler):
#    def get(self):
#        usernames = mrd.select_columns(table="users",column="username")
#        one_user = usernames[0][0]
#        self.render("index.html", user=one_user)
#    def post(self):
#        username = self.get_argument("username")
#        password = self.get_argument("password")
#        user_infos = mrd.select_table(table="users",column="*",condition="username",value=username)
#        if user_infos:
#            db_pwd = user_infos[0][2]
#            if db_pwd == password:
#                self.set_secure_cookie(username, db_pwd, httponly=True, secure=True)
#                self.write(username)
#            else:
#                self.write("pd-not"+username)
#        else:
#            self.write("nm-not")

