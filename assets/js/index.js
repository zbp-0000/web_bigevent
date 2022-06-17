$(function () {

    // 获取用户基本信息
    getUserInfo()

    let layer = layui.layer

    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // console.log('确定');
            // 1.清空本地存储中的 token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // Headers 请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用 renderAvatatr 渲染用户的头像 
            renderAvatatr(res.data)
        },
        // 不论成功或者失败，都会调用这个函数
        complete:function(res) {
            // console.log('执行了 complete 回调函数');
            // console.log(res);
            // 在complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.强制清空 token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    })
}

// 渲染用户的头像 
function renderAvatatr(user) {
    // 1.获取用户名称
    let name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        // 把用户名接过来 并且如果是英文的话 转成大写
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}