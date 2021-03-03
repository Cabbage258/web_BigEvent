$(function () {
    //导入layer
    let layer = layui.layer
    let form = layui.form
    //发起请求获取数据
    initArtCateList()

    //封装获取文章分类列表
    function initArtCateList() {
        //发起ajax请求
        $.ajax({
            //type:'get',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //使用layer.open实现弹出层效果

    //在window下为预先保存弹出层的索引声明一个变量
    let indexAdd = null
    //监听按钮点击事件,触发时,通过layer.open()展示弹出层
    $('#btnAddCate').on('click', function () {
        //保存弹出层的索引,赋值给indexAdd
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //为添加文章分类发起ajax请求
    //通过代理的形式,为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!')
                }
                //调用获取数据请求
                initArtCateList()
                layer.msg('新增分类成功!')
                //根据索引号关闭对应的弹出层
                //如果你想关闭最新弹出的层，直接获取layer.index即可
                // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                layer.close(indexAdd)
            }
        })
    })
//-------------------------------------------------------------------------------
    //通过代理的形式,为btn-edit按钮绑定点击事件
    //在window下为预先保存弹出索引声明一个变量
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        //弹出一个修改文章分类信息的层
        //把这个层赋值给弹出索引indexEdit
        //
        let id = $(this).attr('data-id')


        //发起ajax请求来获取对应分类的数据
        $.ajax({
            //type:'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg('更新分类信息失败!')
                }
                //显示弹出层
                indexEdit = layer.open({
                    type: 1,
                    area: ['500px', '250px'],
                    title: '修改文章分类',
                    content: $('#dialog-edit').html(),
                    success:function(){
                        //弹出层显示出来以后,为弹出层中的表单赋值
                        form.val('form-edit', res.data)
                    }
                })
            }
        })

    })
    //通过代理的形式,为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        //清除表单提交默认行为
        e.preventDefault()
        console.log(123)
        let data = $(this).serialize()
        //发起ajax请求
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败!')
                }
                layer.msg('更新分类数据成功!')
                //根据索引号关闭对应的弹出层
                layer.close(indexEdit)
                //调用获取数据请求函数
                initArtCateList()
                console.log(456)
            }
        })
    })
    //--------------------------------------------------------------

    //------------------------------------------------------------------
    //通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        //提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
                //发起ajax请求
                $.ajax({
                    type: 'get',
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败!')
                        }
                        layer.msg('删除分类成功!')
                        //关闭index索引号的弹出层
                        layer.close(index)
                        //调用请求用户数据函数
                        initArtCateList()
                    }
                })
            }
        )
    })
})