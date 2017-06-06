
/*
 * 一些jQuery的扩展插件
 * version 20140610
*/
;(function ($) {

	$.extend({

		/* 浏览器版本判断 */
		"browser" : function () {

			var browser = {
				mozilla : 0,
				webkit : 0,
				opera : 0,
				msie : 0,
				version : 0,
				nAgt : navigator.userAgent,
				name : navigator.appName,
				fullVersion : '' + parseFloat(navigator.appVersion),
				majorVersion : parseInt(navigator.appVersion,10)
			}, nameOffset, verOffset, ix;

			if ((verOffset = browser.nAgt.indexOf("Opera")) != -1) {
				browser.opera = true;
				browser.name = "Opera";
				browser.fullVersion = nAgt.substring(verOffset+6);
				if ((verOffset = browser.nAgt.indexOf("Version")) != -1) {
					browser.fullVersion = browser.nAgt.substring(verOffset + 8);
				}
			}else if ((verOffset = browser.nAgt.indexOf("MSIE")) != -1) {
				browser.msie = true;
				browser.name = "Microsoft Internet Explorer";
				browser.fullVersion = browser.nAgt.substring(verOffset + 5);
			}else if ((verOffset = browser.nAgt.indexOf("Chrome")) != -1) {
				browser.webkit = true;
				browser.name = "Chrome";
				browser.fullVersion = browser.nAgt.substring(verOffset + 7);
			}else if ((verOffset = browser.nAgt.indexOf("Safari")) != -1) {
				browser.webkit = true;
				browser.name = "Safari";
				browser.fullVersion = browser.nAgt.substring(verOffset + 7);
				if ((verOffset = browser.nAgt.indexOf("Version")) != -1) {
					browser.fullVersion = browser.nAgt.substring(verOffset + 8);
				}
			}else if ((verOffset = browser.nAgt.indexOf("Firefox")) != -1) {
				browser.mozilla = true;
				browser.name = "Firefox";
				browser.fullVersion = browser.nAgt.substring(verOffset + 8);
			}
			else if ( (nameOffset = browser.nAgt.lastIndexOf(' ') + 1) < (verOffset = browser.nAgt.lastIndexOf('/')) ){
				browser.name = browser.nAgt.substring(nameOffset,verOffset);
				browser.fullVersion = browser.nAgt.substring(verOffset + 1);
				if (browser.name.toLowerCase() == browser.name.toUpperCase()) {
					browser.name = navigator.appName;
				}
			}

			if ((ix = browser.fullVersion.indexOf(";")) != -1)
				browser.fullVersion = browser.fullVersion.substring(0, ix);
			if ((ix = browser.fullVersion.indexOf(" ")) != -1)
				browser.fullVersion = browser.fullVersion.substring(0, ix);
				browser.majorVersion = parseInt('' + browser.fullVersion, 10);
			if (isNaN(browser.majorVersion)) {
				browser.fullVersion = '' + parseFloat(navigator.appVersion);
				browser.majorVersion = parseInt(navigator.appVersion,10);
			}
			browser.version = browser.majorVersion;
			return browser;
		}

	});

	$.fn.extend({

		/* 
		 * 滚动事件
		 * 调用方式 el.mousewheel(function (e, delta) { console.log(delta); });
		*/
		"mousewheel" : function (f) {
			var f = f || function () {},
				that = this[0],

				//火狐不支持mousewheel
				mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

	 		if(that.attachEvent){

	 			//如果是IE
	 			that.attachEvent("on" + mousewheelevt, handler, false);
	 		}else if(that.addEventListener){

	 			//如果支持W3C
	 			that.addEventListener(mousewheelevt, handler, false);
	 		}

	 		function handler(event){
	 			var	event = window.event || event,

	 				//统一火狐和W3C的滚动差
	 				delta = event.detail ? - event.detail / 3 : event.wheelDelta / 120;

				//阻止浏览器默认滚动事件
				if(event.preventDefault){
					event.preventDefault();
				}
				event.returnValue = false;

 				return f.call(that, event, delta);
	 		}

	 		return this;
		},

		/* 内容延迟加载，包括图片 */
		"delayLoad" : function (options) {
			var _ = $.extend({
					winScale : 1, // When the elements offset top is the window middle
					fadeAll : false, // What's the time fadeIn the image, only one or all image load
					attrName : "data-src", // The image src attr name
					noImage : function () { }, // If no image, we can add a loading or other image
					everyLoadEnd : function () {}, //Every element load out
					loadEnd : function () { return false; } // When the image loaded out
				}, options), 
				that = this,
				win = $(window),
				imageList = that.attr(_.attrName) ? that : that.find("[" + _.attrName + "]"), // The image parent list
				i = 0,
				num = 0, // The image load number
				len = imageList.length, // The images length
				winScrollTop = 0, // The scrollbar scroll top
				thatOffsetTop = 0, // The box offset top
				imageOffsetTop = []; // All the image offset top

				if(this.length < 1) { return; }

			if(_.fadeAll)  thatOffsetTop = that.offset().top;

			// Push the image offset top in Array
			for(i; i < len; i++) {
				imageOffsetTop.push(imageList.eq(i).offset().top);
			}

			// When images is visible,
			function player() {

				var k = 0;

				// When the elements offset top in the window middle
				winScrollTop = win.scrollTop() + win.height() / _.winScale;

				// If there are no image
				if(len == 0 && winScrollTop >= thatOffsetTop) { _.loadEnd.call(that); }

				for(k; k < len; k++){
					if(_.fadeAll && winScrollTop >= thatOffsetTop) {
						loadImage(imageList.eq(k));
					}else if(!_.fadeAll && winScrollTop >= imageOffsetTop[k]) {
						loadImage(imageList.eq(k));
					}
				}
			}

			// ImageLoad
			function loadImage(el) {

				//If the element is load, return
				if(el.data("load") == 1){ return; }
				el.data({ "load" : 1 });

					var img = new Image();
					img.src = el.attr(_.attrName);

					// If no image
					img.onerror = function () {
						_.noImage.call(el);
						addImage(el);
					}

					if(img.width > 0) {
						addImage(el);
					}else {
						img.onload = function () {
							addImage(el);
						}
					}
			}

			// AddImage
			function addImage(el) {
				num++;
				el.attr({ "src" : el.attr(_.attrName) })
				  .css({ "display" : "none" })
				  .removeAttr(_.attrName).fadeIn(300);
				  _.everyLoadEnd.call(el);

				if(_.fadeAll && num == len) {

					//When all the images are loaded
					_.loadEnd.call(that);

				}
			}

			// Ok, Let's go
			player();

			// When scroll the web
			win.bind("scroll", function () {
				if(_.fadeAll) thatOffsetTop = that.offset().top;
				player();
			});

			return this;
		},

		/* 图片轮播 */
		"carousel" : function (options) {
			var _ = $.extend({
					item : this.find("[data-carousel='item']").children(), //轮播列表
					info : this.find("[data-carousel='title']"), //标题或者介绍
					icon : this.find("[data-carousel='icon']").children(), //上下切换按钮
					page : this.find("[data-carousel='page']"), //底部小图标
					autoPlay : true, //是否自动播放
					time : 4000, //自动轮播时间
					animate : "fade", //变幻效果
					active : "active", //当前样式Class
					playStart : function () {}, //开始播放
					playEnd : function () {} //当一个播放完毕
				}, options),
				that = this,
				init = {
					item : _.item,
					icon : _.icon,
					page : _.page,
					pageList : _.page.children(),
					autoPlay : _.autoPlay,
					timer : null,
					time : _.time,
					coolTime : 300, //冷却时间
					coolOff : true, //冷却开关
					animate : _.animate,
					playStart : _.playStart,
					playEnd : _.playEnd,
					active : _.active,
					len : _.item.length, //列表个数
					num : 0, //当前索引值

					//载入小图标，初始化样式
					addIcon : function () {
						this.item.eq(0).addClass(this.active);

						if(this.pageList.length > 0) {

							//如果存在小图，请在这里写代码

						} else {

							// 如果没有小图，添加小图标
							var iconHtml = "", 
								i = 0;
							for(i; i < this.len; i++) {
								iconHtml += "<span></span>";
							}
							this.page.append(iconHtml)
									 .children(":eq(0)").addClass(this.active);
							this.pageList = this.page.children();
						}
					},

					//变幻
					animation : function (n) {
						var _this = this;

						//设置冷却时间
						if(!_this.coolOff) { return; }
						_this.coolOff = false;
						setTimeout(function () {
							_this.coolOff = true;
						}, _this.coolTime);

						//小图标添加当前位置
						this.pageList.eq(n).addClass(this.active)
							.siblings().removeClass(this.active);

						//淡入淡出
						this.item.eq(n).stop().fadeIn(800, function () {
							_this.playEnd.call($(this));
						}).siblings().stop().fadeOut(800);

					},

					//上一个
					prev : function  () {
						if(this.num == 0) { this.num = this.len; }
						this.num --;
						this.animation(this.num);
					},

					//下一个
					next : function () {
						if(this.num == (this.len - 1)) { this.num = -1; }
						this.num ++;
						this.animation(this.num);
					},

					//自动播放
					player : function () {
						var _this = this;
						if(!_this.autoPlay) { return; }
						_this.timer = setInterval(function () {
							_this.next.call(_this);
						}, _this.time);
					},

					//执行交互
					go : function () {
						var _this = this;

						//添加小图标
						this.addIcon();

						//执行效果之前的回调函数
						_this.playStart.call(that);

						//自动播放
						this.player();

						//左右切换
						this.icon.bind("click",function () {
							switch ($(this).index()) {
								case 0 : _this.prev();
										 break;
								case 1 : _this.next();
										 break;
							}
						});

						//点击小图标
						this.pageList.bind({
							"mouseover" : function () {
								_this.num = $(this).index();
								_this.animation(_this.num);
								if(_this.autoPlay) {
									clearInterval(_this.timer);
									_this.timer = null;
								}
							},
							"mouseout" : function () {
								_this.player();
							}
						});

					}

				}

			//Let it go
			init.go();
			return this;
		},

		//缓冲运动
		"transition" : function(transitionProperty,transitionFunction,transitionDuration,callback){
			var o = this, //当前对象
				property = {}, //参与过渡的属性
				animation = "linear", //过渡动画类型
				duration = 500, //过渡持续时间
				transitionEnd = function () {}, //回调函数
				ease;
	    
		    //根据传递的函数判断
		    for(var i = 0; i < arguments.length; i++){
		        switch(typeof arguments[i]){
		        	case "object" : property = arguments[i];
		        									break;
		        	case "string" : animation = arguments[i];
		        									break;
		        	case "number" : duration = arguments[i];
		        									break;
		        	case "function" : transitionEnd = arguments[i];
		        									break;
		        }
		    }
		    
		    //运动函数
		    ease = function(pos){
		    	switch(animation){
		        	case "easeInQuad" : //慢到快
			        	return Math.pow(pos, 2);
			        	break;
		          case "easeOutQuad" : //快到慢
			          return -(Math.pow((pos-1), 2) -1);
			          break;
		          case "easeInOutQuad" : //慢快慢
			          if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
							  return -0.5 * ((pos-=2)*pos - 2);
							  break;
		          case "easeInCubic" : //慢到快
			          return Math.pow(pos, 3);
			          break;
		          case "easeOutCubic" : //快到慢
			          return (Math.pow((pos-1), 3) +1);
			          break;
		          case "easeInOutCubic" : //慢快慢
			          if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
								return 0.5 * (Math.pow((pos-2),3) + 2);
								break;
		          case "easeInQuart" : //慢到快
			          return Math.pow(pos, 4);
			          break;
		          case "easeOutQuart" : //快到慢
			          return -(Math.pow((pos-1), 4) -1)
			          break;
		          case "easeInOutQuart" : //慢快慢
			          if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
								return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
			    			break;
		          case "easeInQuint" : //慢到快
			          return Math.pow(pos, 5);
			          break;
		          case "easeOutQuint" : //快到慢
			          return (Math.pow((pos-1), 5) +1);
			          break;
		          case "easeInOutQuint" : //慢快慢
			          if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
								return 0.5 * (Math.pow((pos-2),5) + 2);
			    			break;
		          case "easeInSine" : 
			          return -Math.cos(pos * (Math.PI/2)) + 1;
			          break;
		          case "easeOutSine" : 
			          return Math.sin(pos * (Math.PI/2));
			          break;
		          case "easeInOutSine" : 
			          return (-.5 * (Math.cos(Math.PI*pos) -1));
			          break;
		          case "easeInExpo" : 
			          return (pos==0) ? 0 : Math.pow(2, 10 * (pos - 1));
			          break;
		          case "easeOutExpo" : 
			          return (pos==1) ? 1 : -Math.pow(2, -10 * pos) + 1;
			          break;
		          case "easeInOutExpo" : 
			          if(pos==0) return 0;
			          if(pos==1) return 1;
			          if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
			          return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
			      		break;
		          case "easeInCirc" : 
			          return -(Math.sqrt(1 - (pos*pos)) - 1);
			          break;
		          case "easeOutCirc" : 
			          return Math.sqrt(1 - Math.pow((pos-1), 2))
			          break;
		          case "easeInOutCirc" : 
			          if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
							  return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
			    		  break;
		          case "easeOutBounce" : //反弹
			          if ((pos) < (1/2.75)) {
			          	return (7.5625*pos*pos);
				        }else if (pos < (2/2.75)) {
				          return (7.5625*(pos-=(1.5/2.75))*pos + .75);
				        }else if (pos < (2.5/2.75)) {
				          return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
				        }else {
				          return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
				        }
				    		break;
		          case "easeInBack" : //助跑
		          	var s = 1.70158;
		            return (pos)*pos*((s+1)*pos - s);
		            break;
		          case "easeOutBack" : //过线
			          var s = 1.70158;
			          return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
			          break;
		          case "easeInOutBack" : //助跑加过线,这应该罚款
			          var s = 1.70158;
			          if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
			          return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
			          break;
		          case "elastic" : //电击
		            return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
		            break;
		          case "swingFromTo" : //荡秋千
		            var s = 1.70158;
		            return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
		            0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
		            break;
		          case "swingFrom" : //荡秋千开始
		            var s = 1.70158;
		            return pos*pos*((s+1)*pos - s);
		            break;
		          case "swingTo" : //荡秋千结束
		            var s = 1.70158;
		            return (pos-=1)*pos*((s+1)*pos + s) + 1;
		            break;
		          case "bounce" : //强力弹簧
		            if (pos < (1/2.75)) {
		              return (7.5625*pos*pos);
		            } else if (pos < (2/2.75)) {
		              return (7.5625*(pos-=(1.5/2.75))*pos + .75);
		            } else if (pos < (2.5/2.75)) {
		              return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
		            } else {
		              return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
		            }
		            break;
		          case "bouncePast" : //弹过界了
		            if (pos < (1/2.75)) {
		              return (7.5625*pos*pos);
		            } else if (pos < (2/2.75)) {
		              return 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75);
		            } else if (pos < (2.5/2.75)) {
		              return 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375);
		            } else {
		              return 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375);
		            }
		            break;
		          case "easeFromTo" :
		            if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
		            return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
		            break;
		          case "easeFrom" :
		            return Math.pow(pos,4);
		            break;
		          case "easeTo" :
		            return Math.pow(pos,0.25);
		            break;
		          case "linear" : //平滑
		            return pos;
		            break;
		          case "sinusoidal" :
		            return (-Math.cos(pos*Math.PI)/2) + 0.5;
		            break;
		          case "reverse" : //跑反了
		            return 1 - pos;
		            break;
		          case "wobble" : //亮瞎了
		            return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
		            break;
		          case "spring" : //萌呆了
		            return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
		            break;                    
		    	}
		    };

		    for(attr in property){ //暂存初始值
				switch(attr){
					case "opacity" : 
						o.data(attr, o.css(attr)); //透明度另外考虑
						break;
					default : 
						o.data(attr, parseInt(o.css(attr)));
				}
		    }
	    
			(function animation(){
				var	startTime = + new Date(), //开始时间
					time = 10; //值越小，动画越逼真

				setTimeout(function(){
					var newTime = + new Date(),//当前帧开始的时间
						timestamp = newTime - startTime,//用去的时间
						delta = ease(timestamp / duration); //加速度

					for(attr in property){
						var beginValue = o.data(attr), //初始值
							changeValue = parseInt(property[attr]) - o.data(attr); //变化值

						switch(attr){
							case "opacity" : 
								o.css("opacity", Math.ceil(beginValue * 100 + delta * (property[attr] - o.data(attr)) * 100) / 100); 
								break;
							default : 
								o.css(attr, Math.ceil(beginValue + delta * changeValue) + "px");
						}
					}
					
					if(duration <= timestamp){ //时间到了
						for(attr in property){
							switch(attr){
								case "opacity" : 
									o.css("opacity",property[attr]); 
									break;
								default : 
									o.css(attr, parseInt(property[attr]) + "px");
							}
						}
						transitionEnd.call(o); //执行完毕，回调
					}else{
						setTimeout(arguments.callee,time); //循环执行  
					}
				},	time);
						
			})();

			return this;
		},

		/* 图片相对于容器自适应 */
		"imageAuto" : function (options) {

			var that = this.eq(0),
				_ = $.extend({
					contain : that.parent(), //自适应容器
					src : that.attr("data-src"), //图片路径
					animate : "fade", //显示方式
					time : 500, //显示时间
					loadEnd : function () {} //加载结束回调函数
				}, options),

				init = {
					"version" : "2014.05.28",
					contain : _.contain,
					img : new Image(),
					imgSrc : _.src,
					animate : _.animate,
					time : _.time,
					loadEnd : _.loadEnd,
					imageScale : 0,

					// Load the image
					load : function () {
						var _this = this;
						_this.img.src = _this.imgSrc;
						if(_this.img.width > 0){
							//IF lt IE8
							_this.show();
						} else {
							_this.img.onload = function () {
								_this.show.call(_this);
							};
						}
					},

					// For the image positioning
					position : function () {
						var containW = this.contain.width(),
							containH = this.contain.height(),
							containScale = containW / containH, //容器的长宽比
							imageW = this.img.width,
							imageH = this.img.height,
							imageScale = imageW / imageH; //图片的真实长宽比
						if(containScale > imageScale) {
							imageW = containW;
							imageH = imageW / imageScale;
						}else {
							imageH = containH;
							imageW = imageH * imageScale;
						}
						that.css({ "position" : "absolute", top : "50%", left : "50%", "z-index" : 0, width : imageW, height : imageH, "margin-top" : - imageH / 2, "margin-left" : - imageW / 2 });
					},

					// Show the image
					show : function () {
						var _this = this;
						that.attr({ "src" : this.imgSrc });

						_this.position();
						$(window).bind("resize", function () {
							setTimeout(function () {
								_this.position.call(_this);
							}, 100);
						});

						_this.loadEnd.call(that);

						if(!_this.animate) { return; }
						that.css({ "display" : "none" }).fadeIn(_this.time);
					}
				};

			//Let it go
			init.load();
			return this;
		},

		/* 地图加载，主要是百度和Google */
		"createMap" : function (options) {
			var _ = $.extend({
				category : "baidu", //调用什么地图
				latlng : { x : 114.000107, y : 22.544268 }, //地图中心经纬度
				iconSrc : false, //小图标路径
				loadEnd : function () {} // 地图调用完毕
			}, options),
			that = this,

			//百度地图
			bd = {
				"version" : "20140529",

				category : "baidu",
				imgSize : { w : 0, h : 0 },

				//加载小图标
				loadIcon : function (icon) {
					var img = new Image(),
						_this = this;
					img.src = icon;
					if(img.width > 0) {
						_this.imgSize = { w : img.width, h : img.height };
					}else {
						img.onload = function () {
							_this.imgSize = { w : img.width, h : img.height };
						}
					}
				},

				//加载地图
				addMap : function () {

					var _this = this;

					if(_.iconSrc) { _this.loadIcon(_.iconSrc); }

					window.BMap_loadScriptTime = (new Date).getTime(); 
					window.BMap = window.BMap||{};
					window.BMap.apiLoad = function(){
						delete window.BMap.apiLoad;
						if(typeof _this.setMap == "function"){
							_this.setMap(_.latlng, _.iconSrc, _this.imgSize);
						}
					};
					var s = document.createElement('script');
					s.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=OM683kzmZssbdizu2Ak2U5Ta&services=&t=20140528195011';
					document.body.appendChild(s);

				},

				//设置地图
				setMap : function (latlng, iconsrc, imgsize) {
					var map = new BMap.Map(that[0]);                        // 创建Map实例
					map.centerAndZoom(new BMap.Point(latlng.x, latlng.y), 19);     // 初始化地图,设置中心点坐标和地图级别
					//map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
					//map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
					//map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
					//map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
					map.enableScrollWheelZoom(true);						//地图缩放
					
					//Add icon
					if(_.iconSrc) {
						var pt = new BMap.Point(latlng.x, latlng.y),
							myIcon = new BMap.Icon(iconsrc, new BMap.Size(imgsize.w, imgsize.h));
							marker = new BMap.Marker(pt, {icon:myIcon}); //创建标注
						map.addOverlay(marker);
						_.loadEnd.call(map);
					}else {
						//可以添加富标签什么的啊
						_.loadEnd.call(map);
					}
				}

			};

			if(_.category == "baidu") {

				//调用Baidu地图
				bd.addMap();

			} else {
				//调用Google地图

			}

			return this;
		},

		/* 点击滚动到固定位置 */
		"scrollTo" : function (options) {
			var _ = $.extend({
					moveTo : 0, //目标容器，可以传数字或id和class
					time : 500, //滑动时间
					moveEnd : function () {} // 结束回调函数
			 	}, options),
			 	that = this,
			 	distance = 0;
		 	
			function move() {
				switch (typeof _.moveTo) {
					//传入值为数字
					case "number" : distance = _.moveTo;
									break;
					//传入的事对象或者字符串
					default : distance = $(_.moveTo).offset().top;
				}

				$("html, body").stop().animate({ scrollTop : distance }, _.time, function () {
					_.moveEnd.call(that);
				});
			}

			move();
			return this;
		},

		/* 选项卡 */
		"tab" : function (options) {
			var _ = $.extend({
				wrap : this.find("[data-tab='item']"), //容器
				item : this.find("[data-tab='item']").children(), //菜单列表
				page : this.find("[data-tab='page']").children(), //切换小图标
				icon : this.find("[data-tab='icon']").children(), //切换按钮
				animate : false, //交互效果
				active : "active", //当前样式
				autoPlay : true, //是否自动播放
				maxLength : 1,
				time : 5000, //自动轮播间隔时间
				loadEnd : function () {} //回调函数
			}, options),
			that = this,
			tabs = {
				version : "20140610",
				wrap : _.wrap,
				item : _.item,
				page : _.page,
				icon : _.icon,
				animate : _.animate,
				active : _.active,
				autoPlay : _.autoPlay,
				maxLength : _.maxLength,
				num : 0,
				timer : null,
				time : _.time,
				container : null,
				scroller : null,
				loadEnd : _.loadEnd,

				//初始化
				init : function () {
					var _this = this;

					if(_this.item.length > _this.maxLength) {
						_this.page.eq(0).addClass(_this.active);
						_this.icon.eq(1).addClass(_this.active);

						switch(_this.animate) {
							case false : _this.showInit();
										 break;
							case "fade" : _this.fadeInit();
										  break;
							case "translate" : _this.translateInit();
											   break;
						}
					}

				},

				//简单的显示隐藏
				showInit : function () {
					this.page.eq(0).addClass(this.active);
					this.item.css({ "display" : "none" }).eq(0).css({ "display" : "block" });
					this.showPlayer();
				},

				showPlayer : function () {
					var _this = this;
					_this.page.bind("click", function () {
						_this.num = $(this).index();
						$(this).addClass(_this.active).siblings().removeClass(_this.active);
						_this.item.eq(_this.num).show().siblings().hide();
					});
				},

				//淡入淡出效果
				fadeInit : function () {
					this.item.parent().css({ "position" : that.css("position") != "relative" && that.css("position") != "absolute" ? "relative" : that.css("position") });
					this.item.css({ "position" : "absolute", top : 0, left : 0, "display" : "none" })
						.eq(0).css({ "display" : "block" });
					this.fadePlayer();
				},

				fadePlayer : function () {
					var _this = this;
					if(!_this.autoPlay) { return; }
					timer = setInterval( function () {
						_this.icon.eq(1).trigger("click");
					}, _this.time);

					_this.icon.bind("click", function () {
						switch ($(this).index()) {
							case 0 : 	_this.prevPlayer();
										break;
							case 1 : 	_this.nextPlayer();
										break;
						}
					});

					_this.page.bind("click", function () {
						_this.num = $(this).index();
						$(this).addClass(_this.active).siblings().removeClass(_this.active);
					});

				},

				//Prev
				prevPlayer : function () {
					var _this = this;
					if(_this.num == 0) { _this.num = _this.item.length; }
					_this.num --;
					_this.fadeAnimate();
				},

				//Next
				nextPlayer : function () {
					var _this = this;
					if(_this.num == _this.item.length - 1) { _this.num = -1; }
					_this.num ++;
					_this.icon.addClass(_this.active);
					_this.fadeAnimate();
				},

				//Fade animate
				fadeAnimate : function () {
					var _this = this;
					_this.item.eq(_this.num).fadeIn(500).siblings().fadeOut(500);
				},

				//位置切换
				translateInit : function () {
					this.item.wrapAll("<div data-tab='tab_container'><div data-tab='tab_scroller'></div></div>");
					this.container = this.wrap.find("[data-tab='tab_container']"),
					this.scroller = this.wrap.find("[data-tab='tab_scroller']");
					this.item.css({ "float" : "left" });
					this.container.css({ width : this.wrap.width(), "overflow" : "hidden", "position" : "relative" });
					this.scroller.css({ 
						width : this.item.outerWidth(true) * (this.item.length + 1),
						"position" : "relative",
						"left" : 0,
						"clear" : "both"
					});
					this.translatePlayer();
				},

				//
				translatePlayer : function () {
					var _this = this;
					if(!_this.autoPlay) { return; }
					timer = setInterval( function () {
						_this.icon.eq(1).trigger("click");
					}, _this.time);

					_this.icon.bind("click", function () {
						switch ($(this).index()) {
							case 0 : 	_this.prevTranslatePlayer();
										break;
							case 1 : 	_this.nextTranslatePlayer();
										break;
						}
					});

					_this.page.bind("click", function () {
						_this.num = $(this).index();
						_this.scroller.stop().animate({ left : -_this.num * _this.item.outerWidth(true) }, 500);
					});
				},

				prevTranslatePlayer : function () {
					var _this = this;
					_this.scroller.find("child:last").clone(true).prependTo(_this.scroller);
					_this.scroller.find("child:last").remove();
					_this.scroller.css({ left : -_this.item.outerWidth(true) });
					_this.scroller.stop().animate({ left : 0 }, 500);
				},

				nextTranslatePlayer : function () {
					var _this = this;
					_this.scroller.stop().animate({ left : -_this.item.outerWidth(true) }, 500, function () {
						_this.scroller.find("child:first").clone(true).appendTo(_this.scroller);
						_this.scroller.find("child:first").remove();
						_this.scroller.css({ left : 0 });
					});
				}
			}

			tabs.init();
			return this;
		},

		/* 内容相对容器居中 */
		"vertical" : function (options) {
			var _ = $.extend({
				container : this.parent(), //容器
				offset : { top : 0, left : 0 } //偏移量
			}, options), 
			that = this, 
			containerHeight, thatHeight, containerWidth, thatWidth, win = $(window);

			if(_.container.css("position") != "absolute" && _.container.css("css") != "fixed") {
				_.container.css({ "position" : "relative" });
			}

			//Set the element vertical center
			function setVertical() {
				thatHeight = that.outerHeight(true);
				thatWidth = that.outerWidth(true);
				that.css({ 
					"position" : "absolute",
					top : "50%",
					left : "50%",
					"margin-top" : -thatHeight / 2 + _.offset.top,
					"margin-left" : -thatWidth / 2 + _.offset.left
				});
			};

			setVertical();
			//When change the window
			//win.bind("resize", setVertical);
		},

		/* 弹出层 */
		"pop" : function (options) {
			var _ = $.extend({
				container : $("[data-pop='container']"),
				close : $("[data-pop='close']"),
				loadEnd : function () {},
				closeEnd : function () {}
			}, options), that = this, doc = $("html, body");

			that.bind("click", function () {
				_.container.fadeIn(300, function () {
					_.loadEnd.call(that);
				});
				return false;
			});

			_.close.bind("click", function () {
				_.container.fadeOut(300, function () {
					_.closeEnd.call(that);
				});
			});

			return this;
		},

		/* 折叠菜单 */
		"accordion" : function (options) {
			var _ = $.extend({
				header : this.find("[data-accordion='header']"), //标题
				section : this.find("[data-accordion='section']"), //内容
				animate : false, //交互方式
				active : "active", //当前Class
				openEnd : function () {} //展开之后
			}, options), 
			that = this;

			_.header.bind("click", function (){
				var that = $(this);
				that.addClass(_.active).parent().siblings().find(_.header).removeClass(_.active);
				switch (_.animate) {
					case false : showAnimate(that);
							 break;
					case "fade" : fadeAnimate(that);
							 break;
					case "css3" : css3Animate(that);
								  break;
				}
				if(that.next().children().length > 0) {
					return false;
				}
			});

			//显示隐藏
			function showAnimate(el) {
				if(el.data("open") == "1") {
					el.next(_.section).hide();
					el.data({ "open" : 0 });
					return;
				}
				el.data({ "open" : "1" });
				el.next(_.section).show()
				  .parent().siblings().find(_.section).hide();
			}

			//淡入淡出
			function fadeAnimate(el) {

			}

			//自定义CSS3
			function css3Animate(el) {

			}

		},

		/* 列表延迟加载 */
		"delayList" : function(options) {
			var _ = $.extend({
				elements : this.find("[data-delay='item']"), //The elements item
				more : $("[data-delay='more']"), //The button of read more
				loadNumber : 5, //The number of every time loading news
				loadEnd : function () {}, //Every element load out
				allLoadEnd : function () {}
			}, options), that = this, win = $(window);

			function DelayList() {
				this.elements = _.elements;
				this.more = _.more;
				this.loadNumber = _.loadNumber;
				this.startNumber = 0;
				this.maxNumber = 0;
				this.len = this.elements.length;
				this.loadOut = 0;
				this.timer = true;
			}

			DelayList.prototype = {

				//Load image
				loadImage : function (el) {
					var that = this;

					// If this elements has loaded, return this
					if(el.data("load") == 1) { return; }
					el.data({ "load" : 1 });

					// Create a image object.
					var img = new Image();
					img.src = el.attr("data-src");

					if(img.width > 0) {
						that.addItem.call(that, el);
					}else {
						img.onload = function () {
							that.addItem.call(that, el);
						}
					}
					return this;
				},

				//addItem
				addItem : function (el) {
					el.attr({ "src" : el.attr("data-src") });
					this.loadOut ++;
					if(this.loadOut != this.loadNumber) {
						this.timer = false;
						return;
					}
					this.loadOut = 0;
					this.timer = true;
					this.more.text("查看更多");
					this.elements.slice(this.startNumber, this.startNumber + this.loadNumber).each(function (i) {
						_.loadEnd.call($(this));
						$(this).fadeIn(500 + i * 100);
					});
					this.startNumber += this.loadNumber;

					//When all the elements are loaded
					if(this.startNumber == this.len) {
						this.more.text("没有更多内容");
						_.allLoadEnd.call(that);
						this.timer = false;
					}
					return this;
				},

				//The animate
				animate : function () {
					var that = this;
					if(!this.timer) { return; }
					if(this.elements.length < 1) {
						this.more.text("暂无信息");
						return;
					}
					this.more.text("正在加载中....");
					this.loadNumber = (this.startNumber + this.loadNumber > this.len) ? (this.len - this.startNumber) : this.loadNumber;
					this.elements.slice(this.startNumber, this.startNumber + this.loadNumber).each(function () {
						that.loadImage.call(that, $(this).find("img"));
					});
				},

				//Player
				player : function () {
					var that = this;

					//When click the button
					this.more.bind("click", function () {
						that.animate.call(that);
					}).trigger("click");

					//When scroll the scrollbar
					win.bind("scroll", function () {
						if(that.more.offset().top <= win.scrollTop() + win.height()){
							that.animate.call(that);
						}
					});

					return this;
				}

			};

			var o = new DelayList();
			o.player();
			return this;
		},

	});

})(jQuery);


