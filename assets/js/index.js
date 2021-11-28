$(function () {
    getUserInfo()
    var layer = layui.layer
    $('#btnLoginout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            sessionStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        }
        // 无论成功失败，都会调用complete函数
        /* complete: function (res) {
            // 强制清空 token 跳转到主页
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                sessionStorage.removeItem('token')
                location.href = '/login.html'
            }
        } */
    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;' + name)
    // 渲染用户的头像
    if (user.user_pic !== null) {
        // 有图片头像，渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show().siblings('.text-avatar').hide()
    } else {
        // 渲染文本头像
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide().siblings('.text-avatar').text(first).show()
    }
}