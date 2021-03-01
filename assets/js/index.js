$(function(){
    //调用获取用户基本信息
getUserInfo()

    let layer = layui.layer

//点击按钮实现退出功能
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录?',{icon:3,title:'提示'},function(idnex){
            //清空本地存储的token
            localStorage.removeItem('token')
            //重新跳转到登录页面
            location.href = '/login.html'
            //关闭confirm询问框
            layer.close(index)
        })
    })
})
//定义函数获取用户基本信息
function getUserInfo(){
    //发送ajax请求
    $.ajax({
        type:'get',
        url:'/my/userinfo',
        //请求头配置对象
        /*headers:{
            Authorization: localStorage.getItem('token') || ''
        },*/
        success:function(res){
            if(res.status !== 0){
                console.log(res)
                return layui.layer.msg('获取用户数据失败!')
            }
            //调用renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    })
}
//定义renderAvatar,渲染用户头像
    function renderAvatar(user){
    //获取用户的名称(如果有昵称显示昵称,没有就显示用户名)
        let name = user.nickname || user.username
    //设置欢迎的文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户的头像
        if(user.user_pic !== null){
            //渲染图片头像
            $('.layui-nav-img')
                .attr('src',user.user_pic)
                .show()
            $('.text-avatar').hide()
        }else {
            //渲染文本头像
            $('.layui-nav-img').hide()
            let first = name[0].toUpperCase()
            $('.text-avatar')
                .html(first)
                .show()
        }
    }
