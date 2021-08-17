$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页展示数据
        cate_id: '', //筛选分类
        status: '', //筛选状态
    }
    initTable()
    initCate()
        // 初始化表格，文章列表
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.mag('获取文章列表失败')
                }
                var htmlStr = template('tpl-list', res);
                $('tbody').html(htmlStr)
                    // console.log(res);
                renderPage(res.total)
            }
        });
    }

    // 时间补0处理
    function getZero(n) {
        return n < 10 ? '0' + n : n
    }
    // 时间格式化处理
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);
        var y = getZero(dt.getFullYear());
        var m = getZero(dt.getMonth() + 1);
        var d = getZero(dt.getDate());

        var hh = getZero(dt.getHours());
        var mm = getZero(dt.getMinutes());
        var ss = getZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 初始化下拉选择框
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/cate/list",
            success: function(res) {
                if (res.code !== 0) {
                    return '获取文章分类列表失败'
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染表单区域
                form.render()
            }
        });
    }
    // 筛选表单的提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var status = $('[name=status]').val();
        q.cate_id = cate_id;
        q.status = status;
        initTable();

    })

    // 定义分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页切换的回调函数
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 会触发死循环
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })

    }
    // 删除功能，事件委托

    $('tbody').on('click', '.btn-delete', function() {
        // 页面元素的个数
        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).attr('data-id');
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: "DELETE",
                url: "/my/article/info?id=" + id,

                success: function(res) {
                    console.log(res);
                    if (res.code !== 0) {
                        return layer.mag('删除文章失败')
                    }
                    layer.close(index);
                    // initTable() //不能直接渲染，有bug
                    layer.msg('删除文章成功')
                        // 在当前页删除最后一条数据的时候，没有数据渲染出来；在删除的当下页码值没变;但是数据总量在减少，因此分页会减1，数据显示空白
                        // 解决：通过判断当前页
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()

                }
            });


        });
    })


})