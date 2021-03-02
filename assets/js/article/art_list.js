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
                    return layer.msg('呼偶去文章列表失败!')
                }
                //使用模版引擎渲染页面的数据
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
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
})