$(function(){
    let form = layui.form
    let layer = layui.layer
    //校验字符长度
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须在 1 ~ 6 个字符之间! '
            }
        }
    })

//定义函数初始化用户的基本信息
inituserInfo()
function inituserInfo(){
    $.ajax({
        type:'get',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !== 0){
                return layer.msg('获取用户信息失败!')
            }
            //调用form.val()方法为表单赋值
            form.val('formUserInfo',res.data)
        }
    })
}

//点击重置按钮
//阻止表单的默认重置行为,再重新获取用户信息
    //重置表单的数据
    $('#btnReset').on('click',function(e){
        //阻止默认行为
        e.preventDefault()
        //调用initUserInfo()获取用户信息
        inituserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        //取消表单提交的默认行为
        e.preventDefault()
        //ajax请求
        $.ajax({
            type:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                //调用父页面中的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })



})