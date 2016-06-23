var listapp = angular.module('listApp', []);
function getSuccess($scope,$http,response){
    $scope.header = response.header;
    $scope.footer = response.footer;
    $scope.response = response;
    $scope.onclick_auth = function() {
        $http.get(freeUrl)
        .success(function(data) {
            $scope.footer.linkdesc = infoTip.linkdesc;
        });
    };
}


 window.onload = function() {
        if (!window.applicationCache)
            {alert("您的浏览器不支持VR");}
    };

 window.onload = function () {
  // alert("系统是："+navigator.platform)
 var u = navigator.platform;
 if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
// alert("安卓手机");
 } else if (u.indexOf('iPhone') > -1) {//苹果手机
 // alert("苹果手机");
 } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
// alert("winphone手机");
 }else if(u.indexOf('Win') > -1){
  // alert("windows系统")
 }
 };
 
//操作系统检测
// function ismobile(test){
//   var u = navigator.userAgent, app = navigator.appVersion;
//   if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
//    if(window.location.href.indexOf("?mobile")<0){
//     try{
//      if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
//       // return '苹果';
//       window.location.href="404.html";
//      }else{
//       // return '安卓';
//       // window.location.href="404.html";
//      }
//     }catch(e){}
//    }
//   }else if( u.indexOf('iPad') > -1){
//     window.location.href="404.html";
//   }else{
//     // return '安卓';
//   }
// };

// $(document).ready(function(){
//     ismobile(0)
// })


//弹窗广告
// window.onload = setTimeout("open()",3000);
// function open(){
//    $('#doc-modal-1').modal('open');
//    window.setTimeout("close()",5000);
//    $("#hidepopup").click(function(){
//       clearTimeout(int);
//       $('#doc-modal-1').modal('close');
//    })
//    var int = setTimeout("open()",22000);
// }
// function close(){
//   $('#doc-modal-1').modal('close');
// }

// 点赞
  function funzan(th) {
    if ($(th).hasClass('am-icon-thumbs-up')) {return;}else
      {
        $(th).addClass('am-icon-thumbs-up');
        $(th).removeClass('am-icon-thumbs-o-up');
        $(th).text($(th).text() - 0 + 1);
        event.stopPropagation();
    } 
  }

// 收藏
  function funsc(th) {
    if ($(th).hasClass('am-icon-star')) {return;}else{
    $(th).addClass('am-icon-star');
    $(th).removeClass('am-icon-star-o');
    $(th).text($(th).text() - 0 + 1);
    event.stopPropagation(); 
    }
  }


  //banner图
  function funSlide(slides){
    var $slide = $("#indexslide");
    var getSlide = function(i) {
       return '<li><a href="'+slides[i].href+'"><img src="'+slides[i].imgurl+'" /><div class="am-slider-desc">'+slides[i].desc+'</div></a></li>';
    };
    if (slides.length) {
      $slide.flexslider('removeSlide', slides.length);
        for(var i = 0;i<slides.length;i++){
          $slide.flexslider("addSlide",getSlide(i));
        }
    }
  }

  // 方法：获取url中uid的值
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
  }

// 筛选类别
  // function fClass(classArr,augument) {
  //   var uidvalue = GetQueryString(augument); //执行GetQueryString方法并将值赋值给变量
  //   var filterarray = jQuery.grep(classArr, function(value, i) {
  //     if (value.uid == uidvalue) { //筛选出url参数值
  //       i++;
  //       return i;
  //     }
  //   });
  //   for (key in filterarray) {
  //     var classIndex = (filterarray[key]);
  //   }
  //   var index = jQuery.inArray(classIndex, classArr);
  //   return index;
  // }

  // 搜索功能
  $("#searchBtn").bind("click", fSearch);

  function fSearch() {
    var searText = escape($("#searchText").val());
    window.location.href = "search.html?wd=" + searText;
  }


  $(document).ready(function() {
    store = $.AMUI.store;
  });

// 图片画廊
function swipbox(){
    $( '.swipebox' ).swipebox({
    useCSS : true, // false will force the use of jQuery for animations
    useSVG : true, // false to force the use of png for buttons
    hideBarsOnMobile : false, // false will show the caption and navbar on mobile devices
    removeBarsOnMobile :false,
    loopAtEnd:false
  });
}

// 跳转页面
// function jump($scope,$http,th) {
//   var ResID = th.list.ResID;
//   var uid = th.__proto__.classifys.uid; 
//   var Restype = th.__proto__.classifys.type;
//   var href = th.list.href;
//   //判断是不是图库
//     if (Restype == 'photo') {
//         window.location.href = href + '?uid=' + uid + '&resid=' + ResID;
//         return;
//     }
//   else{  
//     window.location.href = 'video.html?uid=' + uid + '&resid=' + ResID;
//   }
// }

function jump(list,classifys) {
  if (list !== null && list !== undefined && classifys !== null && classifys !== undefined) {
    var ResID = list.ResID;
    var uid = classifys.uid; 
    var Restype = classifys.type;
    var href = list.href;
    //判断是不是图库
      if (Restype == 'photo') {
          window.location.href = href + '?uid=' + uid + '&resid=' + ResID;
          return;
      }
    else{  
      window.location.href = 'video.html?uid=' + uid + '&resid=' + ResID;
    }
  }
  else{
    return false;
  }
}

