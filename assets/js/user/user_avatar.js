$(function () {
    // 将base64格式的图片转为blob对象
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(",")
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 初始化图片
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success: res => {
            const blobData = dataURLtoBlob(res.data.user_pic)
            // 将blob对象转为路径
            const urld = URL.createObjectURL(blobData)
            // console.log(urld);
            $image
                .cropper("destroy") // 销毁旧的裁剪区域
                .attr("src", urld) // 重新设置图片路径
                .cropper(options);
        },
    })
    
    $("#file").change((e) => {
        const fileList = e.target.files.length;
        if (fileList === 0) return layer.msg("请选择文件！");

        // 1. 拿到用户选择的文件
        let file = e.target.files[0];
        console.log(file);
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file);
        // console.log(imgURL);
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });
    $("#btnUpload").click(() => {
        // 1、拿到用户裁切之后的头像
        // 直接复制代码即可
        const dataURL = $image.cropper("getCroppedCanvas", {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
            .toDataURL("image/png");
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: res => {
                if (res.status !== 0) return layer.msg('更换头像失败')
                layer.msg('上传头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})