$(function(){
    //导入layer
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    //定义查询参数对象q
    //定义一个查询的参数对象,请求数据时需要将请求参数对象提交到服务器
    let q = {
        pagenum:1,  //页码值,默认请求第一页的数据
        pagesize:2, //每页显示几条数据,默认每页显示2跳条
        cate_id:'', //文章分类的Id
        state:''    //文章的发布状态
    }

    //获取文章列表数据
    function initTable(){
        //发送ajax请求
        $.ajax({
            //type:'get',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败!')
                }
                //使用模版引擎渲染页面的数据
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //通过template.defaults.imports定义过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)
        //年月日时分秒分别赋值给y,m,d,hh,mm,ss
        let y = dt.getFullYear(),m = padZero(dt.getMonth() + 1),d = padZero(dt.getDate())
        let hh = padZero(dt.getHours()),mm = padZero(dt.getMinutes()),ss = padZero(dt.getSeconds())
        //拼接字符串显示
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零的函数
    function padZero(n){
        //三元表达式.如果n大于9,返回n,否则返回0n
        return n > 9 ? n : '0' + n
    }

    //发起请求获取并渲染文章分类的下拉选择框
    //定义initCate函数请求文章分类的列表数据
    //调用
    initTable()
    initCate()
    //封装
    function initCate(){
        //发起ajax请求
        $.ajax({
            //type:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败!')
                }
                //调用模版引擎渲染分类的可选项
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                //通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //实现筛选的功能
    //未筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        //清除表单提交的默认行为
        e.preventDefault()
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //重新调用initTable()渲染表格数据
        initTable()
    })
    //------调用laypage.render方法渲染分页的基本结构----
    //封装renderPage(total)
    function renderPage(total){
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem:'pageBox', //分页容器id
            count:total,    //总数据条数
            limit:q.pagesize,//每页显示几条数据
            curr:q.pagenum,   //设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //分页发生切换的时候,触发jump回调
            //触发条件有两种
            //1.点击页码的时候会触发jump回调
            //2.只要调用了 laypage.render()方法,就会触发jump回调
            jump:function(obj,first){
                console.log(obj.curr)
                //将最新的页码值赋值给q这个查询参数对象中.
                q.pagenum = obj.curr
                //将最新的条目数赋值给q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表,并渲染表格
                //防止进入死循环,首次加载不渲染
                //first代表是否是首次加载
                if(!first){
                    initTable()
                }
            }
        })
    }

    //通过代理为删除按钮监听点击事件
    $('tbody').on('click','.btn-delete',function(){
        //获取文章id
        let id = $(this).attr('data-id')
        //询问用户是否要删除数据
        layer.confirm('确认删除?',{icon:3,title:'提示'},
            function(index){
                //发起ajax请求
                $.ajax({
                    //type:'get',
                    url:'/my/article/delete/' + id,
                    success:function(res){
                        if(res.status !== 0){
                            return layer.msg('删除文章失败!')
                        }
                        layer.msg('删除文章成功!')
                        //当数据完成后,需要判断当前这一页中,是否还有剩余的数据
                        //如果没有剩余的数据了,则让页码值-1之后
                        //再重新调用initTable方法渲染表格
                        if(len === 1){
                            //如果len的值等于1,证明删除完毕之后,页面上就没有任何数据了
                            //如果页数为1,则渲染页数为1,如果页数不为1,则渲染页数 - 1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        //重新渲染表格
                        initTable()
                    }
                })
                //关闭index索引的弹出层
                layer.close(index)
            })
    })
    //监听编辑按钮的点击事件
    $('body').on('click','.btn-edit',function(){
        console.log('123')
        location.href = '../article/art_edit.html?id=' + $(this).attr('data-id')
    })
})