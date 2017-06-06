#!usr/bin/env python
# -*-coding:utf-8-*-

import tornado.web
import time
import json
import os
import Image
from tornado import gen
from login import LoginHandler
# import hashlib



class BackstageHandler(LoginHandler):
    @gen.coroutine
    def get(self):
        db = self.settings['db']
        try:
            username = tornado.escape.json_decode(self.current_user)
            fd = db['users'].find({"username" : username})
            result = yield fd.fetch_next
            if result:
                self.render('backstage.html', piclink="", altinfo="")
            else:
                self.redirect("/login")
        except Exception as e:
            self.redirect("/login")
            print e

    @gen.coroutine
    def post(self):
        db = self.settings['db']
        headpicList = self.request.files.get('pictrue')
        options = str(self.get_argument('options'))
        albumname = str(self.get_argument('albumname'))
        photocatchdate = str(self.get_argument('photocatchdate'))
        albumintroduction = str(self.get_argument('albumintroduction'))
        facepictrue = self.request.files.get('facepictrue')
        pll = []
        altinfo = []
        


        if options == "photo" or "painting" or "web":
            if albumname!="":
                try:
                    os.makedirs('statics/Images/%s/%s'%(options,albumname))
                except Exception as e:
                    pass
                if headpicList:
                    if facepictrue:
                        fp = facepictrue[0]['content_type']
                        fp = fp.split('/')
                        if fp[0] == 'image':
                            data = facepictrue[0]['body']
                            fn = facepictrue[0]['filename'][0:21] + '.' + fp[-1]
                            pic = 'statics/Images/' + options + '/' + albumname + '/' + fn
                            f = open(pic, 'wb')
                            f.write(data)
                            f.close()
                            p = str('Images/' + options + '/' + albumname + '/' + fn )
                            id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
                            sub1 = db[options].insert_one({
                                    "_id": id_,
                                    "albumname": albumname,
                                    "photolink": [],
                                    "photocatchdate": "",
                                    "albumintroduction": "",
                                    "facepictrue": p
                                })
                            result1 = yield sub1
                            print "uplaoded insert object _id: %s"%result1.inserted_id
                            if os.path.getsize(pic) > 1048576:  # 1MB
                                im = Image.open(pic)
                                im.resize(im.size, Image.LANCZOS)
                                im.save(pic, 'JPEG')
                            # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) 
                            # values("%s","%s","%s","","%s")'%(options,albumname,p2,photocatchdate,"yes"))
                            # conn.commit()
                        else:
                            altinfo.append("Please select a image file as facepictrue!")
                        if photocatchdate!="":
                            for i in headpicList:
                                picType = i['content_type']
                                picType = picType.split('/')
                                if picType[0] == 'image':
                                    data = i['body']
                                    fn = i['filename'][0:21] + '.' + picType[-1]
                                    pic = 'statics/Images/' + options + '/' + albumname + '/' + fn
                                    f = open(pic, 'wb')
                                    f.write(data)
                                    f.close()
                                    p = str('Images/' + options + '/' + albumname + '/' + fn )
                                    pll.append(p)
                                    if os.path.getsize(pic)>1048576:
                                        im = Image.open(pic)
                                        im.resize(im.size, Image.LANCZOS)
                                        im.save(pic, 'JPEG')

                                    # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) 
                                    # values("%s","%s","%s","","")'%(options,albumname,p,photocatchdate))
                                    # conn.commit()
                                    # m = hashlib.md5(data)
                                    # value = m.hexdigest()
                                else:
                                    altinfo.append("Please select the image file!")
                            sub2 = db[options].update_one(
                                    {"_id": id_},
                                    {
                                        "$set":{
                                            "photolink": pll,
                                            "photocatchdate":photocatchdate
                                        }
                                    }
                                )
                            result2 = yield sub2
                            print "uplaoded matched: %d , modified: %d"%(result2.matched_count, result2.modified_count)

                            # database.execute('select * from photo where albumname="%s"'%albumname)
                            # album = database.fetchall()
                            # photoncounts = len(album)
                        else:
                            altinfo.append("Please write the photo catch date!")
                    else:
                        altinfo.append("Please select a facepictrue!")
                else:
                    altinfo.append("Please upload your album pictrue!")

                if albumintroduction!="":
                    sub3 = db[options].update_one(
                                {"_id": id_},
                                {
                                    "$set":{
                                        "albumintroduction": albumintroduction
                                    }
                                }
                            )
                    result3 = yield sub3 
                    print "uplaoded matched: %d , modified: %d"%(result3.matched_count, result3.modified_count)

                    # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","","","%s","")'%(options,albumname,albumintroduction))
                    # conn.commit()
                    # print "the introduction of album: ",albumintroduction
                else:
                    altinfo.append("Please write album introduction!")

                cu = db[options].find(limit=1).sort([("_id",-1)])
                yield cu.fetch_next
                print json.dumps(cu.next_object(), sort_keys=True, indent=4)

            else:
                altinfo.append("Please write the information before uploaded pictrue!")

            self.render('backstage.html', piclink=pll, altinfo=altinfo)


        elif options == "share":
            if albumname !="":
                try:
                    os.makedirs('statics/Images/%s/%s'%(options,albumname))
                except Exception as e:
                    pass
                if headpicList:
                    for i in headpicList:
                            picType = i['content_type']
                            picType = picType.split('/')
                            if picType[0] == 'image':
                                fn = i['filename'][0:21]  + '.' + picType[-1]
                                data = i['body']
                                m = hashlib.md5(data)
                                value = m.hexdigest()
                                pic = 'statics/Images/' + options + '/' + albumname + '/' + fn
                                f = open(pic, 'wb')
                                f.write(data)
                                f.close()
                                p = str('Images/' + options + '/' + albumname + '/' + fn)
                                pll.append(p)
                                
                                # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","%s","%s","","")'%(options,albumname,p,photocatchdate))
                                # conn.commit()
                            else:
                                altinfo.append("Please select the image file!")

                    id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
                    sub4 = db[options].insert_one(
                                        {
                                            "_id":id_,
                                            "photolink": pll,
                                            "photocatchdate": photocatchdate,
                                            "albumname": albumname,
                                            "ablumintroduction": ablumintroduction
                                        }
                                )
                    result4 = yield sub4
                    print "insert object _id: %s"%result4.inserted_id

                    if facepictrue:
                        fp = facepictrue[0]['content_type']
                        fp = fp.split('/')
                        if fp[0] == 'image':
                            fn = facepictrue[0]['filename'][0:21] + '.' + fp[-1]
                            data2 = facepictrue[0]['body']
                            pic2 = 'statics/Images/' + options + '/' + albumname + '/' + fn
                            f2 = open(pic2, 'wb')
                            f2.write(data2)
                            f2.close()
                            p2 = str('Images/' + options + '/' + albumname + '/' + fn)
                            sub5 = db[options].update_one(
                                {"_id": id_},
                                {
                                    "$set":{
                                        "facepictrue":p2
                                    }
                                }
                            )
                            result5 = yield sub5
                            print "uplaoded matched: %d , modified: %d"%(result5.matched_count,result5.modified_count)

                            # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","%s","%s","","%s")'%(options,albumname,p2,photocatchdate,"yes"))
                            # conn.commit()
                        else:
                            altinfo.append("Please select a facepictrue!")
                    else:
                        altinfo.append("Please select a facepictrue!")
                else:
                    if albumintroduction!="":
                        sub6 = db[options].update_one(
                                {"_id": id_},
                                {
                                    "$set":{
                                        "albumintroduction": albumintroduction
                                    }
                                }
                            )
                        result6 = yield sub6
                        print "uplaoded matched: %d , modified: %d"%(result6.matched_count,result6.modified_count)

                        # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","","","%s","")'%(options,albumname,albumintroduction))
                        # conn.commit()
                    else:
                        altinfo.append("Please write something or select the image file ! !")

                    cu = db[options].find(limit=1).sort([("_id",-1)])
                    yield cu.fetch_next
                    print json.dumps(cu.next_object(), sort_keys=True, indent=4)

            else:
                altinfo.append("Please write the information before uploaded pictrue!")

            self.render('backstage.html', piclink=pll, altinfo=altinfo)







# from methods.db import *
# import methods.readdb as mrd
# from login import LoginHandler


# # database = conn.cursor() 
# countn = (x for x in range(999))
# class BackstageHandler(LoginHandler):

#     def get(self):
#         username = tornado.escape.json_decode(self.current_user)

#         if username == "-1":
#             user_infos = ((1L, u'Not Right', u'Null', u'Null'),)
#             self.render("user.html", users = user_infos)
#         elif "no_pd" in username:
#            user_infos = ((1L, username.replace("no_pd",''), u'Not Right', u'Null'),)
#            self.render("user.html", users = user_infos)
#         else:
#            self.render('backstage.html', piclink="", altinfo="")

#     def post(self):
#         headpicList = self.request.files.get('pictrue')
#         options = str(self.get_argument('options'))
#         albumname = str(self.get_argument('albumname'))
#         photocatchdate = str(self.get_argument('photocatchdate'))
#         albumintroduction = str(self.get_argument('albumintroduction'))
#         facepictrue = self.request.files.get('facepictrue')
#         pll = []
#         altinfo = []

#         if options == "photo" or "painting" or "web":
#             if albumname!="":
#                 if headpicList:
#                     if facepictrue:
#                         fp = facepictrue[0]['content_type']
#                         fp = fp.split('/')
#                         if fp[0] == 'image':
#                             data2 = facepictrue[0]['body']
#                             pic2 = 'statics/Images/' + facepictrue[0]['filename'][0:21] + '.' + fp[-1]
#                             f2 = open(pic2, 'wb')
#                             f2.write(data2)
#                             f2.close()
#                             p2 = str('Images/' + facepictrue[0]['filename'][0:21] + '.' + fp[-1])
#                             id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
#                             result1 = cur[options].insert_one({
#                                     "_id": id_,
#                                     "albumname": albumname,
#                                     "photolink": [],
#                                     "photocatchdate": "",
#                                     "albumintroduction": "",
#                                     "facepictrue": p2

#                                 })
                            
#                             # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) 
#                             # values("%s","%s","%s","","%s")'%(options,albumname,p2,photocatchdate,"yes"))
#                             # conn.commit()
#                         else:
#                             altinfo.append("Please select a image file as facepictrue!")
#                         if photocatchdate!="":
#                             for i in headpicList:
#                                 picType = i['content_type']
#                                 picType = picType.split('/')
#                                 if picType[0] == 'image':
#                                     data = i['body']
#                                     m = hashlib.md5(data)
#                                     value = m.hexdigest()
#                                     pic = 'statics/Images/' + i['filename'][0:21] + '.' + picType[-1]
#                                     f = open(pic, 'wb')
#                                     f.write(data)
#                                     f.close()
#                                     p = str('Images/' + i['filename'][0:21] + '.' + picType[-1])
#                                     pll.append(p)
#                                     # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) 
#                                     # values("%s","%s","%s","","")'%(options,albumname,p,photocatchdate))
#                                     # conn.commit()
#                                 else:
#                                     altinfo.append("Please select the image file!")
#                             result2 = cur[options].update_one(
#                                     {"_id": id_},
#                                     {
#                                         "$set":{
#                                             "photolink": pll,
#                                             "photocatchdate":photocatchdate
#                                         }
#                                     }
#                                 )
#                             print "matched: %d , modified: %d"%(result2.matched_count,result2.modified_count)
                            
#                             # database.execute('select * from photo where albumname="%s"'%albumname)
#                             # album = database.fetchall()
#                             # photoncounts = len(album)
#                         else:
#                             altinfo.append("Please write the photo catch date!")
#                     else:
#                         altinfo.append("Please select a facepictrue!")
#                 else:
#                     altinfo.append("Please upload your album pictrue!")

#                 if albumintroduction!="":
#                     result3 = cur[options].update_one(
#                                 {"_id": id_},
#                                 {
#                                     "$set":{
#                                         "albumintroduction": albumintroduction
#                                     }
#                                 }
#                             )
#                     print "matched: %d , modified: %d"%(result3.matched_count,result3.modified_count)
#                     # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","","","%s","")'%(options,albumname,albumintroduction))
#                     # conn.commit()
#                     # print "the introduction of album: ",albumintroduction
#                 else:
#                     altinfo.append("Please write album introduction!")

#                 rep = (i for i in cur[options].find().sort("_id",pymongo.DESCENDING))
#                 print json.dumps(rep.next(), sort_keys=True, indent=4)

#             else:
#                 altinfo.append("Please write the information before uploaded pictrue!")

#             self.render('backstage.html', piclink=pll, altinfo=altinfo)


#         elif options == share:
#             if albumname !="":
#                 if headpicList:
#                     for i in headpicList:
#                             picType = i['content_type']
#                             picType = picType.split('/')
#                             if picType[0] == 'image':
#                                 data = i['body']
#                                 m = hashlib.md5(data)
#                                 value = m.hexdigest()
#                                 pic = 'statics/Images/' + i['filename'][0:21]  + '.' + picType[-1]
#                                 f = open(pic, 'wb')
#                                 f.write(data)
#                                 f.close()
#                                 p = str('Images/' + i['filename'][0:21] + '.' + picType[-1])
#                                 pll.append(p)
                                
#                                 # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","%s","%s","","")'%(options,albumname,p,photocatchdate))
#                                 # conn.commit()
#                             else:
#                                 altinfo.append("Please select the image file!")

#                     id_ = time.strftime("%Y_%m_%d_%H_%M_%S")
#                     result4 = cur[options].insert_one(
#                                         {
#                                             "_id":id_,
#                                             "photolink": pll,
#                                             "photocatchdate": photocatchdate,
#                                             "albumname": albumname,
#                                             "ablumintroduction": ablumintroduction
#                                         }
#                                 )

#                     if facepictrue:
#                         fp = facepictrue[0]['content_type']
#                         fp = fp.split('/')
#                         if fp[0] == 'image':
#                             data2 = facepictrue[0]['body']
#                             pic2 = 'statics/Images/' + facepictrue[0]['filename'][0:21] + '.' + fp[-1]
#                             f2 = open(pic2, 'wb')
#                             f2.write(data2)
#                             f2.close()
#                             p2 = str('Images/' + facepictrue[0]['filename'][0:21] + '.' + fp[-1])
#                             result5 = cur[options].update_one(
#                                 {"_id": id_},
#                                 {
#                                     "$set":{
#                                         "facepictrue":p2
#                                     }
#                                 }
#                             )
#                             print "matched: %d , modified: %d"%(result5.matched_count,result5.modified_count)
                            
#                             # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","%s","%s","","%s")'%(options,albumname,p2,photocatchdate,"yes"))
#                             # conn.commit()
#                         else:
#                             altinfo.append("Please select a facepictrue!")
#                     else:
#                         altinfo.append("Please select a facepictrue!")
#                 else:
#                     if albumintroduction!="":
#                         result6 = cur[options].update_one(
#                                 {"_id": id_},
#                                 {
#                                     "$set":{
#                                         "albumintroduction": albumintroduction
#                                     }
#                                 }
#                             )
#                         print "matched: %d , modified: %d"%(result6.matched_count,result6.modified_count)

#                         # database.execute('insert into %s(albumname,photolink,photocatchdate,albumintroduction,facepictrue) values("%s","","","%s","")'%(options,albumname,albumintroduction))
#                         # conn.commit()
#                     else:
#                         altinfo.append("Please write something or select the image file ! !")

#                     rep = (i for i in cur[options].find().sort("_id",pymongo.DESCENDING))
#                     print json.dumps(rep.next(), sort_keys=True, indent=4)

#             else:
#                 altinfo.append("Please write the information before uploaded pictrue!")

#             self.render('backstage.html', piclink=pll, altinfo=altinfo)

