$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    initEditor();
    // 文章分类列表初始化
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/cate/list",
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 绑定点击事件，模拟点击行为
    $('#btnChooseImg').on('click', function() {

            $('#coverFile').click()
        })
        // 选择并替换图片
        // 绑定change事件
    $('#coverFile').on('change', function(e) {
            var files = e.target.files;
            // console.log(files);
            if (files.length === 0) {
                return
            }
            var newImgURL = URL.createObjectURL(files[0])
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区
        })
        // 定义初始值为已发布
    var art_state = "已发布";
    $('#btnsave2').on('click', function() {
        art_state = "草稿"
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 通过FormData对象管理表单数据
        var fd = new FormData($(this)[0]);

        fd.append('state', art_state);
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        // 图片转化为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // fd.forEach(function(v, k) {
                //     console.log(k, v);
                // })

                // 发起请求
                publishArticle(fd)

            })

        function publishArticle(fd) {
            $.ajax({
                type: "POST",
                url: "/my/article/add",
                data: fd,
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('发布文章失败')
                    }
                    layer.msg('发布文章成功');
                    location.href = '/article/art_list.html'

                }
            });
        }

    })

})