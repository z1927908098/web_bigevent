$(function () {
    // login 和 reg 跳转功能
    $('#linkReg').on('click', function () {
        $('.loginBox').hide().siblings('.regBox').show()
    })
    $('#linkLogin').on('click', function () {
        $('.regBox').hide().siblings('.loginBox').show()
    })
    // layUI form校验
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // pwd校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // repwd 和 pwd 密码一直规则
        repwd: function (value) {
            var pwdVal = $('.regBox [name=password]').val()
            if (pwdVal !== value) {
                return '两次输入密码不一致'
            }
        }
    })
    // 监听注册表单提交事件
    $('#regForm').on('submit', function (e) {
        e.preventDefault()
        var data = { username: $('#regForm [name=username]').val(), password: $('#regForm [name=password]').val() };
        $.post('http://api-breakingnews-web.itheima.net/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功！')
                $('#linkLogin').click()
            })
    })
    // 监听提交表单的提交事件
    $('#loginForm').on('submit', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 跳转到主页
                location.href = '/index.html'
            }
        })
    })
})