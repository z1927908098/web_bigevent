$(function () {
    var layer = layui.layer
    var form = layui.form
    var id = location.search.substring(location.search.indexOf('=') + 1)
    initCate()
    initEditor()
    // 获取分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                var catesStr = template('tpl-cate', res)
                $('[name=cate_id]').html(catesStr)
                initFormEdit()
                form.render()
            }
        })
    }

    // 1.cropper实现裁剪效果 获取对象
    var $image = $('#image')
    // 2. 裁剪选项 设置选项
    var options = {
        aspectRatio: 400 / 280,// 裁剪区大小
        preview: '.img-preview'// 裁剪展示位置
    }
    // 3.初始化裁剪区域 把选项给对象
    $image.cropper(options)

    // 渲染
    function initFormEdit() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章详情失败！')
                }
                // 赋值给当前页面
                form.val('form-edit', res.data)
                // 渲染文章类别默认项
                tinymce.get('content').setContent(res.data.content);
            }
        })
    }
    // 选择封面
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
        // 更换裁剪图片
        $('#coverFile').on('change', function (e) {
            // 获取文件列表
            var files = e.target.files
            // 判断用户是否选择了文件
            if (files.length === 0) {
                return layer.msg('请选择文件！')
            }
            // 根据文件创建url地址
            var newImageURL = URL.createObjectURL(files[0])
            $image.cropper('destroy').attr('src', newImageURL).cropper(options)
        })
    })

    // 定义文章发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('Id', id)
        fd.append('state', art_state)
        $image.cropper('getCroppedCanvas', { width: 400, height: 280 }).toBlob(function (blob) {
            fd.append('cover_img', blob)
            publishArticle(fd)
        })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章失败！')
                }
                layer.msg('更新文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})