$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/cate/list",
            success: function(res) {
                var htmlStr = template('tpl-list', res);
                $('tbody').html(htmlStr)
            }
        });
    }
    // 添加图书

    var indexadd = null;

    $('#btnAddCate').on('click', function() {
        // 添加弹出层
        indexadd = layer.open({
            type: "1",
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dailog-add').html()
        });
        // console.log(indexadd);

    })

    // 表单提交事件；动态添加通过事件代理方式绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/cate/add",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('新增图书失败')
                }
                layer.msg('新增图书成功')
                layer.close(indexadd);
                initArtCateList();
            }
        });
    })

    // 修改编辑图书；
    // 通过事件代理给tbody绑定事件
    var indexedit = null;
    $('tbody').on('click', ".btn-edit", function() {
        // 编辑弹出层
        indexedit = layer.open({
            type: "1",
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dailog-edit').html()
        });
        // console.log(indexedit);
        // 获取当前文章信息
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/cate/info/?id=" + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });

    })

    // 提交修改表单
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: "/my/cate/info",
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('更新文章失败')
                }

                layer.msg('更新文章成功')
                initArtCateList();
                layer.close(indexedit)
            }
        });
    })

    // 删除模块，事件委托
    $('tbody').on('click', ".btn-remove", function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "DELETE",
                url: "/my/cate/del?id=" + id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章成功')
                    layer.close(index);
                    initArtCateList()
                }
            });
        });
    })
})