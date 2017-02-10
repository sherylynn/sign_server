import API from './api'
//let path = API.host +API.login;
console.log(API);
$(function () {
    const db_user_local= new PouchDB('user');
    let path="http://192.168.0.249:3000/user/login"
    
    console.log(path);
    $('#btn').on('click', function () {
        var email = $('#email').val();
        var password = $('#password').val();
        var loginInfo = $(".login-info");
        //必填验证
        if (!email || !password) {
            loginInfo.removeClass("hidden").text("注册邮箱或密码必须填写，不能为空！");
            email.focus();
            return;
        }
        //组装数据
        var obj = {
            email,
            password,
            deviceId:'browser'
        };
        //登录请求
        $.ajax({
            type: 'POST',
            url: path,
            dataType: 'json',
            data: obj
        }).done(function (data) {
            if (data.status) {
                window.location.href = '/';
            } else {
                loginInfo.removeClass("hidden").text("注册邮箱或密码不正确，请重新登录！");
            }
        }).fail(function () {
            loginInfo.removeClass("hidden").text("系统出现异常，稍后重试！");
        });
    });
});
