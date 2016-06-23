// 支付方法
function pay(resid,classifys,$scope,$http) {
    var ResID = resid.ResID;
    var uid = classifys.uid;  
    var Restype = classifys.type;
    var subject = resid.title;
    var body = resid.desc;
    var amount = resid.payment.pay;
    var href = resid.href;
    var payok = store.get('paid');
    var username = store.get('userId');
    var myVideo=document.getElementById("videoId");
    // 默认微信支付
    $scope.isActive = true;
    $scope.payWayBtn = infoTip.payWayBtnWx;
    $scope.wxRadio = true;
    $scope.zfbRadio = false;
    // var payUrl = 'http://139.159.0.30:8020/devicemanage/index.php/RestPingPP';
    var payUrl = 'json/app.json';

    // 判断是否免费2d视频
    if (amount === 0 && Restype == 'video-2d') {
        $scope.hidePlayBg = true; 
        myVideo.play(); 
        return;
    }

    //判断是不是图库
    if (Restype == 'photo') {
        window.location.href = href + '?uid=' + uid + '&resid=' + ResID;
        return;
    }
    
    // 判断是否免费VR视频
    if (amount === 0) {
        $scope.hidePlayBg = true; 
        window.location.href = href;
        return;
    }


    //显示loading弹窗
    $('#loading').modal({ closeViaDimmer: false });
        //请求一次 检测是否支付过？
    $http.post(payUrl, PostUserData(username, ResID, Restype, subject, body))
        .success(function(data) {

            //曾支付过！直接跳转
            if (data.paid) {
                window.location.href = href;
            }

            // 未支付就弹窗
            else {
                // 关闭loading
                $('#loading').modal('close');
                // 默认微信支付
                // $scope.isActive = true;
                // $scope.payWayBtn = '确认微信支付';
                // $scope.wxRadio = true;
                // $scope.zfbRadio = false;
                //支付方式弹窗
                $('#my-confirm').modal({
                    // 确认支付按钮事件
                    onConfirm: function() { listclick(username, ResID, amount, Restype, subject, body);}
                });
            }
        });

    // 已有账户点击登录 
    $scope.hasAcc = function() {
        $('#my-confirm').modal('close');
        $('#my-login').modal({
            onConfirm: function() {
                var username = $scope.username;
                $('#loading').modal({ closeViaDimmer: false });
                //请求一次 检查该账户是否购买过此商品
                $http.post(payUrl, PostUserData(username, ResID, Restype, subject, body))
                    .success(function(data) {
                        $('#loading').modal('close');
                        //曾支付过！直接跳转
                        if (data.paid) {
                            window.location.href = href;
                            store.set('userId', data.UserName);
                            store.set('paid', data.paid);
                        }
                        // 未支付就弹窗
                        else {
                            store.set('userId', data.UserName);
                            store.set('paid', data.paid);
                            $('#my-login').modal('close');
                            $scope.errmsg = infoTip.errTipRecord;
                            $('#errormsg').modal({ closeViaDimmer: false });
                        }
                    });
            }
        });
    };

    //请求的json数据 
    function PostUserData(username, ResID, Restype, subject, body) {
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


    function listclick(username, ResID, amount, Restype, subject, body) {
        store.set('userUrl', window.location.href);
        var channel = ($scope.wxRadio)?'wx_pub':'alipay_wap';
        $('#loading').modal({closeViaDimmer: false});
        $http.post(payUrl,PostJsonData(channel, username, ResID, amount, Restype, subject, body))
        .success(function(data) {
            $('#loading').modal('close');
            funPay(data);
        });

        // $.ajax({
        //     url: 'json/app.json',
        //     type: 'POST',
        //     dataType: 'json',
        //     data: JSON.stringify(PostJsonData(channel, username, ResID, amount, Restype, subject, body)),
        //     beforeSend: function() {
        //         $('#loading').modal({
        //             closeViaDimmer: false
        //         });
        //     },
        //     success: function(data) {
        //         funPay(data);
        //     },
        //     complete: function() {
        //         $('#loading').modal('close');
        //     }
        // });

        function PostJsonData(channel, username, ResID, amount, Restype, subject, body) {
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

    // post请求后的回调函数
    function funPay(ajaxData) {
        var payData = ajaxData;
        if (payData.result === 0) {
            if (payData.charge.channel == 'wx_pub') {
                paycharge(payData, 'wxPay');
            } else if (payData.charge.channel == 'alipay_wap') {
                paycharge(payData, 'aliPay');
            }
        } else {
            $('#errormsg').modal({closeViaDimmer: false});
            $scope.errmsg = payData.error;
        }
    }

    // 支付接口
    function paycharge(payData, mypayway) {
        $scope.newUserName = payData.UserName;
        var charge = payData.charge;
        if (mypayway == 'wxPay') {
            pingpp.createPayment(charge, function(result, error) {
                store.set('paid', payData.paid);
                if (result == "success") {
                    if (!payData.IsMobile) {
                        $('#paySuccess').modal({
                            onConfirm: function(e) {
                                var mobile = $scope.userMobile;
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
                    $('#errormsg').modal();
                    scope.errmsg = infoTip.errTipCancel;
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
        // var mobile = mobile;
        $('#loading').modal({closeViaDimmer: false});
        $http.post(payUrl,ChargeResult(payData, result, mobile))
        .success(function(data) {
            $('#loading').modal('close');
            if (data.result) {
              $('#errormsg').modal();
              scope.errmsg = data.error;
            }
        });
        // $.ajax({
        //     url: 'json/app.json',
        //     type: 'POST',
        //     dataType: 'json',
        //     data: JSON.stringify(ChargeResult(payData, result, mobile)),
        //     success: function(data) {
        //         if (data.result) {
        //             $('#errormsg').modal().find(".am-modal-bd").text(data.error);
        //         }
        //     },
        //     beforeSend: function() {
        //         $('#loading').modal({
        //             closeViaDimmer: false
        //         });
        //     },
        //     complete: function() {
        //         $('#loading').modal('close');
        //     }
        // });

        function ChargeResult(payData, result, mobile) {
            if (mobile !== '') {
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
    $("#paySuccBack").ready(function() {
        store.set('paid', true);
    });
    $("#payErrorBack").ready(function() {
        store.set('paid', false);
    });

    // 支付方式radio切换
    $scope.paytoggle = function(index) {
        switch (index) {
            case 0:
                $scope.isActive = true;
                $scope.payWayBtn = infoTip.payWayBtnWx;
                $scope.wxRadio = true;
                $scope.zfbRadio = false;
                break;
            case 1:
                $scope.isActive = false;
                $scope.payWayBtn = infoTip.payWayBtnZfb;
                $scope.zfbRadio = true;
                $scope.wxRadio = false;
                break;
        }
    };
}
