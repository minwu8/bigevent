$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称必须在1~6个字符之间"
            }
        }

    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                //form.val()取值
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 绑定重置按钮
    $('#btnReset').on('click', function(e) {
            e.preventDefault()
            initUserInfo()

        })
        // 绑定表单提交修改事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功')
                window.parent.getUserInfo()
            }

        });
    })


})