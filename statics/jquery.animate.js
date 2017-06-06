
// 2014.10.11

$(function () {

	// Home animation
	(function homeDelay(){

		var el = $('.home'),
			item = $('.ui-load'),
			i = 0,
			len = item.length;

		for( ; i < len; i++ ) {
			(function (e) {
				item.eq(e).delayLoad({
					everyLoadEnd : function () {
						this.addClass('css3');
					}
				});
			})(i);
		}


	})();

});

var proces;
var delay = 0.5; //milisecond scroll top
var scrollPixel = 100; //pixel U want to change after milisecond
//Fix Undefine pageofset when using IE 8 below;
function getPapeYOfSet() {
	var yOfSet = (typeof (window.pageYOffset) === "number") ? window.pageYOffset : document.documentElement.scrollTop;
	return yOfSet;
}

function backToTop() {
	proces = setInterval(function () {
		var yOfSet = getPapeYOfSet();
		if (yOfSet === 0) {
			clearInterval(proces);
		} else {
			window.scrollBy(0, -scrollPixel);
		}
	}, delay);
};



function setPage(opt){
    if(!opt.pageDivId || opt.allPageNum < opt.curpageNum || opt.allPageNum < opt.showPageNum){return false};

    var allPageNum = opt.allPageNum; //总的页数
    var showPageNum = opt.showPageNum; //显示的页数
    var curpageNum = opt.curpageNum; // 当前的页数
    var pageDIvBox = document.getElementById(opt.pageDivId);

    //左边或右边显示页码的个数
    var lrNum = Math.floor(showPageNum/2); 

        // if(curpageNum>1){
        //  var oA = document.createElement('a');
        //    oA.href='#1';
        //    oA.innerHTML = '首页'
        //    pageDIvBox.appendChild(oA);
        // }
        
        if(curpageNum>1){
            var oA = document.createElement('a');
                oA.href = (curpageNum-1);
                oA.innerHTML = 'Prev<span class="ui-icon"></span>';
                oA.setAttribute("class", "icon-prev ui-rel");
                oA.setAttribute("name", "pa");
                pageDIvBox.appendChild(oA);
        }

        if(curpageNum<showPageNum-2 || allPageNum == showPageNum){
            for(var i=1;i<=showPageNum;i++){
                var oA = document.createElement('a');
                oA.href = i;
                if(curpageNum==i){
                    oA.innerHTML = i;
                    oA.setAttribute("class", "active");
                }else{
                    oA.innerHTML = i;   
                };
                oA.setAttribute("name", "pa");
                pageDIvBox.appendChild(oA);
            }  
        }else{
            //倒数第一页的处理
            if(allPageNum-curpageNum<lrNum && curpageNum == allPageNum-1){
                for(var i=1;i<=showPageNum;i++){
                    console.log((curpageNum - showPageNum + i));
                    var oA = document.createElement('a');
                    oA.href = (curpageNum - (showPageNum-1) + i);
                    if(curpageNum == (curpageNum - (showPageNum-1) + i)){
                        oA.innerHTML = (curpageNum - (showPageNum-1) + i)
                        oA.setAttribute("class", "active");
                    }else{
                        oA.innerHTML = (curpageNum - (showPageNum-1) + i)
                    };
                    oA.setAttribute("name", "pa");
                    pageDIvBox.appendChild(oA);
                }
            }
            //最后一页的处理
            else if(allPageNum-curpageNum<lrNum && curpageNum == allPageNum){
                for(var i=1;i<=showPageNum;i++){
                    console.log((curpageNum - showPageNum + i));
                    var oA = document.createElement('a');
                    oA.href = '/'+ (curpageNum - showPageNum + i);
                    if(curpageNum == (curpageNum - showPageNum + i)){
                        oA.innerHTML = (curpageNum - showPageNum + i)
                        oA.setAttribute("class", "active");
                    }else{
                        oA.innerHTML = (curpageNum-showPageNum + i)
                    };
                    oA.setAttribute("name", "pa");
                    pageDIvBox.appendChild(oA);
                }
            }else{
                for(var i=1;i<=showPageNum;i++){
                    var oA = document.createElement('a');
                    oA.href = (curpageNum - (showPageNum-lrNum) + i);
                    if(curpageNum == (curpageNum - (showPageNum-lrNum) + i)){
                        oA.innerHTML = (curpageNum - (showPageNum-lrNum) + i)
                        oA.setAttribute("class", "active");
                    }else{
                        oA.innerHTML = (curpageNum - (showPageNum-lrNum) + i)
                    };
                    oA.setAttribute("name", "pa");
                    pageDIvBox.appendChild(oA);
                }
            }
        }


        if(curpageNum<allPageNum){
                var oA = document.createElement('a');
                oA.href = (parseInt(curpageNum)+1);
                oA.innerHTML = 'Next<span class="ui-icon"></span>';
                oA.setAttribute("class", "icon-next ui-rel");
                oA.setAttribute("name", "pa");
                pageDIvBox.appendChild(oA);
        }


        // if(curpageNum<allPageNum){
        //  for(var i=1;i<=2;i++){
        //    if(i==1){
        //        var oA = document.createElement('a');
        //        oA.href='#'+(parseInt(curpageNum)+1);
        //        oA.innerHTML = '下一页'
        //    }else{
        //        var oA = document.createElement('a');
        //        oA.href='#'+allPageNum;
        //        oA.innerHTML = '尾页'

        //    }
        //    pageDIvBox.appendChild(oA);
        //  }
        // }

       
        var oA = document.getElementsByName('pa');
        //给页码添加点击事件
        for(var i=0;i<oA.length;i++){
            oA[i].onclick = function(){
                var papap = document.getElementById("pagenumm").innerHTML;
                var pagenumm=new Number(papap);
                //当前点的页码
                url = this.getAttribute('href').split("/",5)[2];
                var sHref = url;
                //清空页数显示
                pageDIvBox.innerHTML = '';
                setPage({
                    pageDivId:'page',
                    showPageNum:4, //显示的个数
                    allPageNum:pagenumm, //总页数
                    curpageNum:sHref //当前页数
                });
            };
        };
    };
    
    
    window.onload = function(){
        var shref = window.location.href.split("/",5)[4];
        var papap = document.getElementById("pagenumm").innerHTML;
        var pagenumm=new Number(papap);
        setPage({
            pageDivId:'page',
            showPageNum:4, //显示的个数
            allPageNum:pagenumm, //总页数
            curpageNum:shref //当前页数
        }); 
};

