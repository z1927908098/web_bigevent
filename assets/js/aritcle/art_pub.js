$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本
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

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(fd);
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})