//自定义密码框校验规则
$(function(){
    let form = layui.form
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须为 6 - 12 位,且不能出现空格!'],
        samePwd:function(value) {
            //校验新密码内容是否与原密码相同
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同!'
            }
        },
        rePwd:function(value){
            //校验再次输入框是否与新密码输入框内容一致
            if(value !== $('[name=newPwd]').val()){
                return '两次输入密码不一致!'
            }
        }
    })
    //发起ajax请求实现重置密码的功能
    $('.layui-form').on('submit',function(e){
        //取消提交表单的默认行为
        e.preventDefault();
        //ajax请求
        $.ajax({
            type:'post',
            url:'/my/updatepwd',
            //序列化表单值,转为url文本字符串
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败!')
                }
                layui.layer.msg('更新密码成功!')
                //重置表单,$('.layui-form')[0]为表单
                $('.layui-form')[0].reset()
            }
        })
    })
})