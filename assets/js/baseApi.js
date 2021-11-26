// 每次调用$.get() $.post() $.ajax() 都会调用ajaxPrefilter这个函数
// options参数为我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})