$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义查询对象，请求时将参数传递到服务器
    var q = {
        pagenum: 1,// 起始页：1
        pagesize: 2,// 每页显示多少条数据，默认每页显示2条
        cate_id: '',// 文章分类的 Id
        state: ''// 文章的发布状态
    }
    // 初始化
    form.render()
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var tableStr = template('tpl-table', res)
                $('tbody').html(tableStr)
                renderPage(res.total)
            }
        })
    }
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var cateStr = template('tpl-cate', res)
                $('[name=cate_id]').html(cateStr)
                form.render()
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    // 分页模块设置
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',// 渲染目标
            count: total,// 总页数
            limit: q.pagesize,// 每页显示数据
            curr: q.pagenum,// 起始页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next'],
            // jump 回调触发：1.点击页码，2.调用了laypage.render
            // 如果first的值为true，方式2触发。如果值为undefined，方式1触发
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                // 非第一次触发jump回调
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理为删除事件添加处理函数
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).data('id');
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            var len = $('.btn-delete').length
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 数据删除完成后，需要判断当前表格页是否还有数据
                    // 无数据应该让页码值-1
                    // 判断当前页删除按钮的个数
                    if (len === 1) {
                        // 如果按钮数=1，删除后当前表格页无数据
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })

    // 为点击编辑添加页面跳转事件
    $('tbody').on('click', '.btn-edit', function () {
        location.href = '/article/art_edit.html?id=' + $(this).data('id')
    })
})