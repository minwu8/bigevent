$(function() {
    var form = layui.form;
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            samepwd: function(value) {
                var pwd = $('[name=old_pwd]').val()
                if (pwd === value) {
                    return '新旧密码一样'
                }

            },
            repwd: function(value) {
                if ($('[name=new_pwd]').val() !== value) {
                    return '密码不一致'
                }
            }
        })
        // 表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: "PATCH",
            url: "/my/updatepwd",
            data: $(this).serialize(),

            success: function(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layui.form.msg('更新密码失败')
                }
                layui.form.msg('更新密码成功')
                $('.layui-form')[0].reset()
            }
        });
    })

})