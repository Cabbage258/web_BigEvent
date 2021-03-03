$(function(){
    //导入layui
    let layer = layui.layer
    let form = layui.form
    //加载文章分类
    initCate()
    //初始化富文本编辑器
    initEditor()
    //定义加载文章分类的方法
    function initCate(){
        $.ajax({
            //type:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败!')
                }
                layer.msg('初始化文章分类成功!')
                //console.log(res.status)
                //调用模版引擎,渲染分类的下拉菜单
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                //有些时候，你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。
                //只需执行form.render()方法即可重新渲染全部类型的表单
                form.render()
            }
        })
    }

    //剪裁效果设置
    //初始化图片剪裁器
    let $image = $('#image')
    //剪裁选项
    let options = {
        aspectRatio:400 / 200,
        preview:'.img-preview'
    }
    //初始化剪裁区域
    $image.cropper(options)

    //监听选择封面按钮的点击事件
        $('#btnChooseImage').on('click',function(){
            console.log('点击按钮')
            $('#coverFile').click()
        })
    //将选择的图片设置到剪裁区域中
    //监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change',function(e){
        //获取到文件的列表数组
        let files = e.target.files
        //判断用户是否选择了文件
        if(files.length === 0){
            return
        }
        //根据文件,创建对应的URL地址
        let newImgURL = URL.createObjectURL(files[0])
        //为剪裁区域重新设置图片
        $image
            .cropper('destroy')     //销毁旧的剪裁区域
            .attr('src',newImgURL)  //重新设置图片路径
            .cropper(options)       //重新初始化剪裁区域
    })
    //定义文章的发布状态
    let art_state = '已发布'

    //为存草稿按钮绑定点击事件
    $('#btnSave2').on('click',function(){
        art_state = '草稿'
    })

    //为表单绑定submit提交事件
    $('#form-pub').on('submit',function(e){
        //阻止表单默认提交行为
        e.preventDefault()
        //基于form表单,快速创建一个FormData对象
        let fd = new FormData($(this)[0])
        //将文章的发布状态,存到fd中
        fd.append('state',art_state)
        //将封面剪裁过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas',{
                //创建一个Canvas画布
                width:400,
                height:280
            }).toBlob(function(blob){
                //将canvas画布上的内容,转化为文件对象,得到文件对象后
                //再进行后续操作.
                //将文件对象,存储到fd中
                fd.append('cover_img',blob)
            //发起ajax数据请求
            publishArticle(fd)
        })
    })

    //封装一个发布文章的方法
    function publishArticle(fd){
        $.ajax({
            type:'post',
            url:'/my/article/add',
            data:fd,
            //如果想服务器提交的是FormData格式数据,必须添加下面两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('文章发布失败!')
                }
                layer.msg('文章发布成功!')
                //发布文章成功后,跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})