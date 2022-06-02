$(function () {
    const form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd: (val) => {
            if (val === $("[name=oldPwd]").val()) return "新旧密码不能相同！";
        },
        rePwd: (val) => {
            if (val !== $("[name=newPwd]").val()) return "两次密码不一致！";
        },
    });
    $(".layui-form").on("submit", (e) => {
        e.preventDefault();
        layer.confirm("确定修改密码？", { icon: 3, title: "" }, function () {
            $.ajax({
                type: "POST",
                url: "/my/updatepwd",
                data: $(".layui-form").serialize(),
                success: (res) => {
                    if (res.status !== 0) return layer.msg("更新密码失败！");
                    localStorage.removeItem("token");
                    // 重新跳转到登录页面
                    window.parent.location.href = "/login.html";
                    alert("修改密码成功请重新登录")
                },
            });
        })
    });
    $('.icon').on('click', function () {
        const index = $('.icon').index(this);
        if ($('.layui-input').eq(index).attr('type') == 'password') {
            $(this).css('background','url(/assets/images/20210804104455948.png) no-repeat center')
            $('.layui-input').eq(index).attr('type', 'text')
        } else {
            $(this).css('background','url(/assets/images/20210804104527512.png) no-repeat center')
            $('.layui-input').eq(index).attr('type', 'password')
        }
    })
})
