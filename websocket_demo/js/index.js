// 左边盒子显示隐藏
$(".HideBox").click(function () {
    $(".rightBox").hide();
    $(".leftBox").show();

});
$(".leftHideBox").click(function () {
    $(".leftBox").hide();
    $(".rightBox").show();
});

//聊天窗口收起展开
$("#ipt").click(function(){
    $(".collectArea").css('height','8rem');
    $("#ipt").css('height','4rem');
    $("#ipt").css('line-height','1rem');
});
$(".talkArea").click(function(){
    $(".collectArea").css('height','3.2rem');
    $("#ipt").css('height','2rem');
    $("#ipt").css('line-height','2rem');
});

//手动选择
$(".downIcon").click(function(){
    $(".downIcon").css('display', 'none');
    $(".rolling").css('height','3rem');
    $(".upIcon").css('display','block');
    $(".checkArea").css('display','block');
});
$(".upIcon").click(function(){
    $(".downIcon").css('display', 'block');
    $(".rolling").css('height','.8rem');
    $(".upIcon").css('display','none');
    $(".checkArea").css('display','none');
});

//声明全局变量
var ws;

// 当点击btn按钮时发送消息
var btn = document.getElementById('btn');
btn.onclick = function () {
    var msg = $('#ipt').val();
    console.log(msg);
    var seat = getCookie("seat");
    var nickname = getCookie("name");
    if(''!=msg){
        $.ajax({
            url:path+'/webchat/send',
            type:'post',
            data:'msg='+msg+'&nickname='+nickname+"&seatNum="+seat,
            async : true, //默认为true 异步
            error:function(){
                alert('error');
            },
            success:function(data){
                // $("#"+divs).html(data);
            }
        });
    }
};

//弹窗 sweetalert
swal({
    title: '选择座位',
    type: 'info',
    html: '<div class="row"><div class="col-md-5"> <select class="form-control seatFirst">' +
    '<option>A</option>' +
    '<option>B</option>' +
    '<option>C</option>' +
    '</select></div>' +
    '<div class="col-md-5"> <select class="form-control seatSecond">' +
    '<option>1</option>' +
    '<option>2</option>' +
    '<option>3</option>' +
    '</select></div>' +
    '<div class="col-md-5"> ' +
    '<input type="text" placeholder="请输入用户名" id="username" class="form-control seatThree">' +
    '</div>' +
    '</div>',
    allowOutsideClick: false,
    confirmButtonText: '确定'
}).then(function () {
    var hh = $(".seatFirst").val();
    var h2 = $(".seatSecond").val();
    var username = $("#username").val();
    console.log(hh + h2 + username);

    setCookie("name", username);
    setCookie("seat", hh+h2);

    /*先弹窗后启动websocket*/
    WebSoc();

});

/*弹窗样式*/
$(".swal2-modal").css('width', "90%");
$(".swal2-modal").css('padding', "1.5rem");
$(".swal2-title").css('font-size', '1.5rem');
$(".col-md-5 select").css('width', '100%');
$(".col-md-5 select").css('height', '2rem');
$(".col-md-5 select").css('line-height', '2rem');
$(".col-md-5 select").css('margin-bottom', '.5rem');
$(".col-md-5 select").css('font-size', '1rem');
$(".seatFirst").css('margin-right', '0');


/*启动WebSocket*/
function WebSoc(){
    // 与服务器建立链接 h1+h2代表唯一id hh+h2
    ws =new WebSocket('ws://192.168.12.20' + '/boyanews/webChat/client/clientwebchat');
    // 发消息
    // 链接建立完成时，触发
    ws.onopen = function () {
        console.log('链接完成');
        // 发消息
        ws.send('嗨')
    };
    // 客户端接收消息
    ws.onmessage = function (res) {

        // 解析返回的json
        console.log(res.data);
        var data = JSON.parse(res.data);

        /*创建标签*/
        var p=document.createElement('p');
        var img = document.createElement('img');
        img.src = 'img/timg.jpg';
        var span = document.createElement('span');
        var i=document.createElement('i');
        i.innerHTML=data.time;
        var em=document.createElement('em');
        em.innerHTML = data.nickname + ":" + data.msg;

        //判断是发出的消息还是收到的消息
        if(getCookie('name')==data.nickname){
            // 发出的消息
            p.setAttribute('id','perRight');
        }else{
            // 接收到消息之后，把它添加到页面上
            p.setAttribute('id','perLeft');
        }
        /*插入到页面中*/
        var talkArea=document.getElementById('talkArea');
        talkArea.appendChild(p);
        p.appendChild(img);
        p.appendChild(span);
        span.appendChild(i);
        span.appendChild(em);

        //自动滚轴 勾选checked就手动滚轴
        var div=document.getElementById('talkArea');
        if($("#handle2").is(":checked")){
            div.scrollTop=0;
        }else{
            div.scrollTop=div.scrollHeight;
        }
    };
}

//设置cookie
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expries     =" + exp.toGMTString();
}

//获取cookie
var allcookies = document.cookie;
function getCookie(cookie_name) {
    var allcookies = document.cookie;
    //索引的长度
    var cookie_pos = allcookies.indexOf(cookie_name);

    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
            cookie_end = allcookies.length;
        }

        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}

// 判断cookie是否存在,存在不弹盒子，不存在将盒子弹出
var cookie_val = getCookie("name");
var c_start = unescape(document.cookie.indexOf("name="));
/*alert(cookie_val);*/
if (c_start == -1) {
    $(".swal2-container").css('display', 'block');
} else {
    //判断如果cookie有值，不弹窗，直接启动websocket
    $(".swal2-container").css('display', 'none');
    WebSoc();
}


