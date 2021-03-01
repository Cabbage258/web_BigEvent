$(function () {
    //1.设置点击切换登录注册盒子
    //点击"去注册账号"的连接
    //点击注册时隐藏登录盒子显示注册盒子
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击"去登陆"的连接
    //点击去登陆时隐藏注册盒子显示登录盒子
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //自定义校验规则
    //从layui中获取form对象
    let form = layui.form
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位,且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //这里的形参value是确认密码框中的内容
            //再与密码框中的内容[.reg-box [name=password]进行比较
            let pwd = $('.reg-box [name=password]').val()
            //如果密码框中的内容和再次输入密码框中的内容不同,返回两次密码不一致
            if (pwd !== value) {
                return '两次输入密码不一致!'
            }
        }
    })

    //2.发起注册用户的ajax请求
    //为注册表单添加id为form_reg
    //监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        //发起ajax的post请求
        //将填入表单的数据作为键值赋值给变量data
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        //ajax请求
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data,
            //请求成功回调函数
            success: function (res) {
                /*if (res.status !== 0) {
                    //这里使用layui提供的layer提示消息样式.layer.msg('提示消息')
                    //当status不为0时,返回 解析提示文本内容,即返回提示错误原因
                    return layer.msg(res.message)
                }*/
                //请求成功时,返回layer提示文本内容为:"注册成功,请登录!"
                layer.msg('注册成功,请登录!')
                //调用"去登陆"点击事件函数,即注册成功后返回登录页面
                $('#link_login').click()
            },
            error:function(err){
                return layer.msg(err.message)
            }
        })
    })
    //3.发起登录的ajax请求
    //为登录表单添加id为form_login
    //绑定监听表单的提交事件
    $('#form_login').on('submit', function (e) {
        //阻止默认的提交行为
        e.preventDefault()
        //ajax请求
        $.ajax({
            type: 'post',
            url: '/api/login',
            //.serialize() 方法创建以标准 URL 编码表示的文本字符串。
            //这里this指向事件绑定的元素对象
            data: $(this).serialize(),
            //请求成功回调函数
            success: function (res) {
                if (res.status !== 0) {
                    //返回错误时,用layer提示消息"登录失败!"
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!')
                //将登录成功得到的token字符串,保存到localStorage中(值为一个可被用于访问当前源（ origin ）的本地存储空间的 Storage 对象。)
                //token用于有权限接口的身份认证
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/BigEvent_practice/index.html'
            }
            /*error:function (err) {
                console.log(err)
            },*/
        })
    })
})