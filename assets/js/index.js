$(function() {
        getUserInfo()
        var layer = layui.layer;
        $('#btnLogout').on('click', function() {
            layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function(index) {
                // 删除本地token
                localStorage.removeItem('token')
                    // 跳转login页面
                location.href = '/login.html'
                layer.close(index);
            });
        })

    })
    // 获取用户信息，发起请求
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        //   请求头

        success: function(res) {
            if (res.code !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
                // console.log(res);
        },


    });
}

function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avator').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.text-avator').html(first).show();
        $('.layui-nav-img').hide();

    }
}