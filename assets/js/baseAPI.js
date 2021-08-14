$(function() {
    $.ajaxPrefilter(function(options) {
        // options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        options.url = 'http://www.liulongbin.top:3008' + options.url

        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }

        }
        // 解决手动访问index文件问题；优化权限控制 
        options.complete = function(res) {

            if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html'
            }

        }

    })
})