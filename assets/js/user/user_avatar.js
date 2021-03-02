$(function(){
    let layer = layui.layer
//--------------cv-------------------------------------
    //获取剪裁区域的DOM元素
    let $image = $('#image')
    //配置选项
    const options = {
        //纵横比
        aspectRatio:1,
        //指定预览区域
        preview:'.img-preview'
    }
    //创建剪裁区域
    $image.cropper(options)
//----------------------------------------------------
    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click',function(){
        //触发file的点击事件
        $('#file').click()
    })

    //为文件选择框绑定 change 事件
    $('#file').on('change',function(e){
        //获取用户选择的文件
        let filelist = e.target.files
        if(filelist.length === 0){
            return layer.msg('请选择图片!')
        }

        //----------cv-----------------
        //拿到用户选择的文件
        let file = e.target.files[0]
        //将文件转化为路径
        let imgURL = URL.createObjectURL(file)
        //重新初始化剪裁区域
        $image
            .cropper('destroy')//销毁旧的剪裁区域
            .attr('src',imgURL)//重新设置图片路径
            .cropper(options)//重新初始化剪裁区域
    })

    //为确定按钮绑定点击事件
    $('#btnUpload').on('click',function(){
        //--------------------cv----------
        //拿到用户剪裁之后的头像
        let dataURL = $image
            .cropper('getCroppedCanvas',{
                //创建一个canvas画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')//将canvas画布上的内容,转化为base64格式的字符串
        //------------------------------
        //ajax请求,把头像上传到服务器
        $.ajax({
            type:'post',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('头像更换失败!')
                }
                layer.msg('头像更换成功!')
                //调用父窗口中的getUserInfo()方法渲染新头像
                window.parent.getUserInfo()
            }
        })
    })
})