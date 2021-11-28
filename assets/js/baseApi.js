// 每次调用$.get() $.post() $.ajax() 都会调用ajaxPrefilter这个函数
// options参数为我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 拼接统一的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 为含有/my/的请求接口设置headers请求头
    if (options.url.indexOf('/my/')) {
        options.headers = {
            Authorization: sessionStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            sessionStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})