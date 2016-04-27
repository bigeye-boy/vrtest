  $(".am-icon-thumbs-o-up").bind("click", funzan);

  function funzan() {
    $(this).addClass('am-icon-thumbs-up');
    $(this).removeClass('am-icon-thumbs-o-up');
    $(this).text($(this).text() - 0 + 1);
    $(this).unbind('click', funzan);
  }
  $(".am-icon-star-o").bind("click", funsc);

  function funsc() {
    $(this).addClass('am-icon-star');
    $(this).removeClass('am-icon-star-o');
    $(this).text($(this).text() - 0 + 1);
    $(this).unbind('click', funsc);
  }

  // 方法：获取url中uid的值
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  function fClass(classArr) {
    var uidvalue = GetQueryString("uid"); //执行GetQueryString方法并将值赋值给变量
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
        if (desc.indexOf(searchWd) > -1 || title.indexOf(searchWd) > -1) {
          arrayObj.push(searArr[i].list[j]);
        }
      }
    }
    if (arrayObj !== null) {
      return arrayObj;
    } else {
      $(".searchErr").text('未搜到结果，请重新输入！')
    }

  }

$(document).ready(function(){
    store = $.AMUI.store;
})


$(".am-list").bind('click',function(){
    // var username = GetQueryString('username');
    // var payok = GetQueryString('paid');
    var payok = store.get('paid');
    var username = store.get('userId');
    // var payok = store.get('paid');
    if (payok) {window.location.href = 'video.html';}
    else{
        $('#my-confirm').modal({
             onConfirm:function(){listclick(username);}
        });
    } 
})


function listclick(username){
        store.set('userUrl',window.location.href);
        var channel;
        var payway = $('#checkpay').find(':checked').attr('id');
        if (payway == 'payway-wx') {
           channel = 'wx_pub';
        }
        else if(payway == 'payway-zfb'){
          channel = 'alipay_wap';
        }
        $.ajax({
          url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(PostJsonData(channel,username)),
          success:function(data){
            funPay(data);
          }
        }); 
        function PostJsonData(channel,username) { 
          var json = { 
              "action":"Charge",
              "AppName":"APCloud", 
              "UserName":username, 
              "Res_type":"FILM", 
              "ResID":3,
              "Subject":"电影",
              "Body":"独立日",
              "Channel":channel, 
              "amount":100,
              "currency":"cny",
              "PayType":"Charge",
              'success_url':'http://127.0.0.1/test/list/alipay.html',
              'cancel_url':'http://127.0.0.1/test/list/alipayErr.html',
              "debug":1
              }; 
              return json; 
        }
        
    }

// 已有账户>登录
$("#hasAcc").bind('click',function() {
    $('#my-confirm').modal('close');
    $('#my-login').modal({
        onConfirm:function(){
          var user = $('#logintext').val();
          $.ajax({
            url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(PostUserData(user)),
            success:function(data){
                if (data.paid == true) {
                    // window.location.href = window.location.href+'&username='+data.UserName+'&paid='+data.paid;
                    window.location.href = window.location.href;
                    store.set('userId',data.UserName);
                    store.set('paid',data.paid);
                }
                else{
                  store.set('paid',data.paid);
                  $('#my-login').modal('close');
                  // $('#errormsg').modal({closeViaDimmer:false}).find(".am-modal-bd").text(data.error);
                  $('#errormsg').modal({closeViaDimmer:false}).find(".am-modal-bd").text('未查到购买记录');
                }
            }
          })

          function PostUserData(user){
              var json = { 
              "action":"Charge",
              "AppName":"APCloud", 
              "UserName":user, 
              "Res_type":"FILM", 
              "ResID":3,
              "Subject":"电影",
              "Body":"独立日",
              "Channel":"" ,
              "debug":1
              }; 
              return json; 
          }


        }
    });
});

// post请求后的回调函数
function funPay(ajaxData){
  var payData = ajaxData;
  if (payData.result==0) {
    if (payData.paid) {
      window.location.href = "video.html";
    }
    else{
       if (payData.charge.channel == 'wx_pub') {
          paycharge(payData,'wxPay');
        } 
        else if (payData.charge.channel == 'alipay_wap') {
          paycharge(payData,'aliPay');
        }
    }
  }
  else{
    $('#errormsg').modal({closeViaDimmer:false}).find(".am-modal-bd").text(payData.error);
  }
}

// 支付接口
function paycharge(payData,mypayway){
    $('#userName').text(payData.UserName);
      var charge = payData.charge;
          if (mypayway == 'wxPay') {
                  pingpp.createPayment(charge, function(result, error){
                    store.set('paid',payData.paid);
                if (result == "success") {
                        store.set('userId',payData.UserName);
                        store.set('paid',payData.paid);
                        if (!payData.IsMobile) {
                          $('#paySuccess').modal({
                            closeViaDimmer:false,
                            onConfirm: function() {
                              var mobile = $('#userMobile').val();
                              postresult(payData,result,mobile);
                              window.location.href = "video.html";
                            },
                            onCancel: function(e) {
                              postresult(payData,result);
                              window.location.href = "video.html";
                            }
                        });
                      }
                      else {
                          postresult(payData,result);
                          $("#paySuccess").modal().find('.am-modal-bd').add('.paysubmit').remove().find('.payclose').css("width","100%");
                          store.set('userId',payData.UserName);
                          store.set('paid',payData.paid);
                      } 
                    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                } else if (result == "fail") {
                    postresult(payData,result);
                    // charge 不正确或者微信公众账号支付失败时会在此处返回
                } else if (result == "cancel") {
                    postresult(payData,result);
                    $('#errormsg').modal().find(".am-modal-bd").text("您已取消支付");
                    // 微信公众账号支付取消支付
                }
            });
          }
          else if (mypayway == 'aliPay') {
               pingpp.createPayment(charge, function(result, error){
               });
                // postresult(payData,result);
          }
          
}

// 支付成功之后的回调函数(弹窗)
function modalsucc(payData,result){
  // if (!payData.IsMobile) {
  //         $('#paySuccess').modal({
  //           closeViaDimmer:false,
  //           relatedTarget: this,
  //           onConfirm: function(e) {
  //             postresult(payData,result,e.data);
  //             window.location.href = "video.html";
  //           },
  //           onCancel: function(e) {
  //             postresult(payData,result);
  //             window.location.href = "video.html";
  //           }
  //       });
  //     }
  //     else {
  //         $("#paySuccess").modal().find('.am-modal-bd').add('.paysubmit').remove().find('.payclose').css("width","100%");

  //     }         
}

// 支付成功之后的回调函数(post日志)
function postresult(payData,result,mobile){
  store.set('userId',payData.UserName);
  store.set('paid',payData.paid);
  var charge = payData.charge;
    $.ajax({
      url: 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(ChargeResult(payData,result,mobile)),
      success:function(data){
        if (data.result) {
          $('#errormsg').modal().find(".am-modal-bd").text(data.error);
        }
      }
    })
    function ChargeResult(payData,result,mobile){
      // var mobile = $('#userMobile').val();
      var json = {
        "action":"ChargeResult", 
        "userPaid":result, 
        "AppName":"APCloud", 
        "order_id":payData.charge.order_no,
        "pay_id":payData.charge.id,
        "mobile":mobile, 
        "debug":1
      }; 
      return json;
    }
}



// -----------------------------

$(".pay_list_c1").on("click",function(){
  $(this).addClass("on").parent('label').siblings().find('.pay_list_c1').removeClass("on");
  var paytext = ($(this).siblings('span.am-fl').text());
  $("#paybtn").text('确认la'+paytext);
})    
