$(function () {
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            var oldPwd = $('form [name=oldPwd]').val()
            if (value === oldPwd) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            var newPwd = $('form [name=newPwd]').val()
            if (value !== newPwd) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                $('.layui-form')[0].reset()
            }
        })
    })
})