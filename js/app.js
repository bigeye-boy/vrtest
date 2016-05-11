 window.onload = function() {
        if (!window.applicationCache)
            {alert("您的浏览器不支持VR")}
    }

  //$(".am-icon-thumbs-o-up").bind("click", funzan);

  function funzan(th) {
    $(th).addClass('am-icon-thumbs-up');
    $(th).removeClass('am-icon-thumbs-o-up');
    $(th).text($(th).text() - 0 + 1);
    event.stopPropagation(); 
  }
  //$(".am-icon-star-o").bind("click", funsc);

  function funsc(th,event) {
    $(th).addClass('am-icon-star');
    $(th).removeClass('am-icon-star-o');
    $(th).text($(th).text() - 0 + 1);
    event.stopPropagation(); 
    event.preventDefault(); 
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
    if (r != null) return unescape(r[2]);
    return null;
  }

  function fClass(classArr,augument) {
    var uidvalue = GetQueryString(augument); //执行GetQueryString方法并将值赋值给变量
    var filterarray = jQuery.grep(classArr, function(value, i) {
      if (value.uid == uidvalue) { //筛选出url参数值
        return i = i + 1;
      }
    });
    for (key in filterarray) {
      var classIndex = (filterarray[key]);
    }
    var index = jQuery.inArray(classIndex, classArr);
    return index;
  }

  // 搜索功能
  $("#searchBtn").bind("click", fSearch);

  function fSearch() {
    var searText = escape($("#searchText").val());
    window.location.href = "search.html?wd=" + searText;
  }

  function showSearch(searArr) {
    var searchWd = GetQueryString("wd");
    var arrayObj = new Array();
    for (var i = 0; i < searArr.length; i++) {
      for (var j = 0; j < searArr[i].list.length; j++) {
        var desc = searArr[i].list[j].desc;
        var title = searArr[i].list[j].title;
        var type = searArr[i].type;
        var uid = searArr[i].uid;
        if (type == 'app' ) {continue;}
        else if (desc.indexOf(searchWd) > -1 || title.indexOf(searchWd) > -1) {
          var listObj = searArr[i].list[j];
          listObj.uid = uid;
          arrayObj.push(listObj);
        }
      }
    }
    if (arrayObj.length != 0) {
      return arrayObj;
    } else {
      $(".searchErr").text('未搜到结果，请重新输入！')
    }

  }

  $(document).ready(function() {
    store = $.AMUI.store;
  })


function pay(th){
    var thisId = $(th).attr('data-id');
    var ResID;
    var Restype;
    var subject;
    var body;
    var amount;
    $.getJSON('http://localhost/test/list/json/app.json', function(json) {
        var classifys = json.classifys;
        for(var i = 0;i<classifys.length;i++){
          for(var j = 0;j<classifys[i].list.length;j++){
              var ResID = classifys[i].list[j].ResID;
              if(ResID==thisId){
                 Restype = classifys[i].title;
                 subject = classifys[i].list[j].title;
                 body = classifys[i].list[j].desc;
                 amount = classifys[i].list[j].payment.pay;
                 var ResID = classifys[i].list[j].ResID;
                 return Restype;
                 console.log(Restype);
                break;
              }
          }
        }
    })
    var payok = store.get('paid');
    var username = store.get('userId');
    $.ajax({
      url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(PostUserData(username,ResID,Restype,subject,body)),
      success: function(data) {
        if (data.paid) {
          window.location.href = 'video.html';
        } else {

          $('#my-confirm').modal({onConfirm: function() {listclick(username,ResID,amount,Restype,subject,body);}}); 

          // 已有账户点击登录 
          $("#hasAcc").click(function(){
            $('#my-confirm').modal('close');
              $('#my-login').modal({
                onConfirm: function() {
                  var username = $('#logintext').val();
                  $.ajax({
                    url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(PostUserData(username,ResID,Restype,subject,body)),
                    success: function(data) {
                      if (data.paid == true) {
                        window.location.href = window.location.href;
                        store.set('userId', data.UserName);
                        store.set('paid', data.paid);
                      } else {
                        store.set('paid', data.paid);
                        $('#my-login').modal('close');
                        // $('#errormsg').modal({closeViaDimmer:false}).find(".am-modal-bd").text(data.error);
                        $('#errormsg').modal({
                          closeViaDimmer: false
                        }).find(".am-modal-bd").text('未查到购买记录');
                      }
                    },
                    beforeSend: function() {
                      $('#loading').modal({
                        closeViaDimmer: false
                      })
                    },
                    complete: function() {
                      $('#loading').modal('close');
                    }
                  })
                }
              })
          })
          // ---------------------------
        }
      },
      beforeSend: function() {
        $('#loading').modal({
          closeViaDimmer: false
        })
      },
      complete: function() {
        $('#loading').modal('close');
      }
    });  
}


  function PostUserData(username,ResID,Restype,subject,body) {
    var json = {
      "action": "Charge",
      "AppName": "APCloud",
      "UserName": username,
      "Res_type": Restype,
      "ResID": ResID,
      "Subject": subject,
      "Body": body,
      "Channel": "",
      "debug": 1
    };
    return json;
  }


  function listclick(username,ResID,amount,Restype,subject,body) {
    store.set('userUrl', window.location.href);
    var channel;
    var payway = $('#checkpay').find(':checked').attr('id');
    if (payway == 'payway-wx') {
      channel = 'wx_pub';
    } else if (payway == 'payway-zfb') {
      channel = 'alipay_wap';
    }
    $.ajax({
      url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(PostJsonData(channel,username,ResID,amount,Restype,subject,body)),
      beforeSend: function() {
        $('#loading').modal({
          closeViaDimmer: false
        })
      },
      success: function(data) {
        funPay(data);
      },
      complete: function() {
        $('#loading').modal('close');
      }
    });

    function PostJsonData(channel,username,ResID,amount,Restype,subject,body) {
      var json = {
        "action": "Charge",
        "AppName": "APCloud",
        "UserName": username,
        "Res_type": Restype,
        "ResID": ResID,
        "Subject": subject,
        "Body": body,
        "Channel": channel,
        "amount": amount,
        "currency": "cny",
        "PayType": "Charge",
        'success_url': 'http://127.0.0.1/test/list/alipay.html',
        'cancel_url': 'http://127.0.0.1/test/list/alipayErr.html',
        "debug": 1
      };
      return json;
    }

  }

  // 已有账户>登录
      // function modalLogin(username,ResID,Restype,subject,body){
      //     $('#my-confirm').modal('close');
      //       $('#my-login').modal({
      //         onConfirm: function() {
      //           var username = $('#logintext').val();
      //           $.ajax({
      //             url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
      //             type: 'POST',
      //             dataType: 'json',
      //             data: JSON.stringify(PostUserData(username,ResID,Restype,subject,body)),
      //             success: function(data) {
      //               if (data.paid == true) {
      //                 window.location.href = window.location.href;
      //                 store.set('userId', data.UserName);
      //                 store.set('paid', data.paid);
      //               } else {
      //                 store.set('paid', data.paid);
      //                 $('#my-login').modal('close');
      //                 // $('#errormsg').modal({closeViaDimmer:false}).find(".am-modal-bd").text(data.error);
      //                 $('#errormsg').modal({
      //                   closeViaDimmer: false
      //                 }).find(".am-modal-bd").text('未查到购买记录');
      //               }
      //             },
      //             beforeSend: function() {
      //               $('#loading').modal({
      //                 closeViaDimmer: false
      //               })
      //             },
      //             complete: function() {
      //               $('#loading').modal('close');
      //             }
      //           })
      //         }
      //       })
      // };

  // post请求后的回调函数
  function funPay(ajaxData) {
    var payData = ajaxData;
    if (payData.result == 0) {
      if (payData.charge.channel == 'wx_pub') {
        paycharge(payData, 'wxPay');
      } else if (payData.charge.channel == 'alipay_wap') {
        paycharge(payData, 'aliPay');
      }
    } else {
      $('#errormsg').modal({
        closeViaDimmer: false
      }).find(".am-modal-bd").text(payData.error);
    }
  }

  // 支付接口
  function paycharge(payData, mypayway) {
    $('#userName').text(payData.UserName);
    var charge = payData.charge;
    if (mypayway == 'wxPay') {
      pingpp.createPayment(charge, function(result, error) {
        store.set('paid', payData.paid);
        if (result == "success") {
          if (!payData.IsMobile) {
            $('#paySuccess').modal({
              onConfirm: function(e) {
                var mobile = $('#userMobile').val();
                postresult(payData, result, mobile);
                window.location.href = "video.html";
              },
              onCancel: function(e) {
                postresult(payData, result);
                window.location.href = "video.html";
              }
            });
          } else {
            postresult(payData, result);
            $("#paySuccess").modal().find('.am-modal-bd').add('.paysubmit').remove().find('.payclose').css("width", "100%");
          }
          // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
        } else if (result == "fail") {
          postresult(payData, result);
          // charge 不正确或者微信公众账号支付失败时会在此处返回
        } else if (result == "cancel") {
          postresult(payData, result);
          $('#errormsg').modal().find(".am-modal-bd").text("您已取消支付");
          // 微信公众账号支付取消支付
        }
      });
    } else if (mypayway == 'aliPay') {
      pingpp.createPayment(charge, function(result, error) {});
      postresult(payData, result);
    }

  }


  // 支付成功之后的回调函数(post日志)
  function postresult(payData, result, mobile) {
    var charge = payData.charge;
    var mobile = mobile;
    $.ajax({
      url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(ChargeResult(payData, result, mobile)),
      success: function(data) {
        if (data.result) {
          $('#errormsg').modal().find(".am-modal-bd").text(data.error);
        }
      },
      beforeSend: function() {
        $('#loading').modal({
          closeViaDimmer: false
        })
      },
      complete: function() {
        $('#loading').modal('close');
      }
    })

    function ChargeResult(payData, result, mobile) {
      if (mobile != '') {
        store.set('userId', mobile);
        store.set('paid', payData.paid);
      } else {
        store.set('userId', payData.UserName);
        store.set('paid', payData.paid);
      }
      var json = {
        "action": "ChargeResult",
        "userPaid": result,
        "AppName": "APCloud",
        "order_id": payData.charge.order_no,
        "pay_id": payData.charge.id,
        "mobile": mobile,
        "debug": 1
      };
      return json;
    }
  }


// 支付宝成功
$("#paySuccBack").ready(function(){
  store.set('paid', true);
})
$("#payErrorBack").ready(function(){
  store.set('paid', false);
})

// 支付方式radio切换
function paytoggle(paytogg){
  $(paytogg).addClass("on").parent('label').siblings().find('.pay_list_c1').removeClass("on");
    var paytext = ($(paytogg).siblings('span.am-fl').text());
    $("#paybtn").text('确认' + paytext);
}

function footerUrl() {
   var url = window.location.url;
   var freeurl =  GetQueryString("freeurl");
   return freeurl;
}