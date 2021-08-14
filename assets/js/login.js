$(function() {
    // 点击去注册
    $('#link_reg').on('click', function() {
            $('.login_box').hide();
            $('.reg_box').show();
        })
        // 点击去登录
    $('#link_login').on('click', function() {
        $('.reg_box').hide();
        $('.login_box').show();
    })

    // 密码框校验
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 这里的value形参接受的就是表单的值
            repass: function(value) {
                var pwd = $('.reg_box [name=password]').val();
                if (pwd !== value) {
                    return '密码不一致'
                }
            }
        })
        // 监听表单的注册提交事件，注意是表单的submit，而不是提交按钮;阻止默认行为
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = $('#form_reg').serialize()
            // {
            //     username: $('#form_reg [name=username]').val(),
            //     password: $('#form_reg [name=password]').val(),
            // }
        $.post('/api/reg', data, function(res) {
            if (res.code !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            layer.msg("注册成功")
            $('#link_login').click()
        })

    })
    $('#form_login').on('submit', function(e) {

        e.preventDefault();
        var data = $('#form_login').serialize();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: data,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                console.log(res.token);
                // 登录成功返回token信息
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        });

    })



})