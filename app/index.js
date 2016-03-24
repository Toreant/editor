/**
 * Created by apache on 16-3-22.
 */

var $ = require('./jquery.min');
var ipc = require("electron").ipcRenderer;
var $code = $("#code"),
    $aside = $(".mAside"),
    $line = $('.line');

var TYPE = {
    1 : "标识符",
    2 : "注释",
    3 : "关键字",
    4 : "标点符号",
    5 : "字符串",
    6 : "空格",
    7 : "数字",
    9 : "特殊符号",
    10 : "换行",
    11 : "结束标志",
    12 : "不符合规则的表达"
};

var scanBtn = document.getElementById('scan');

scanBtn.addEventListener('click',function(e) {
    var code = $code.val();

    ipc.send('edit-scan',code);
});

scanBtn.addEventListener('mouseover',function(e) {
    $(".tip").fadeIn();
});

$code.on('input',function(e) {
    var input = $(this).val().split(/\n/);
    $line.css('transform','translateY(-'+$(this).scrollTop()+'px)');
    $line.empty();
    for(var i = 0, num = input.length; i < num; i++) {
        var lineNum = $line.children('span').length;
        var newNum = '<span class="line-num">' + (i+1) +'</span>';
        $line.append(newNum);
    }
});

ipc.on('code-receive',function(event,args) {
    $(".token-list").empty().append(show(args));
    $aside.animate({'right': '0'},400);
});

$(".backBtn").click(function() {
    $aside.animate({'right':'-100%'},400);
});

$code.on('scroll',function(e) {
    $line.css('transform','translateY(-'+$(this).scrollTop()+'px)');
});

$(".token-list").on('mouseover','li',function(e) {
    throttle(over,{
        text : $(this).children('.token').text(),
        type : $(this).children('.badge').text(),
        e : e
    });
});

$(".token-list").on('mouseout','li',function(e) {
    clearTimeout(over.id);
    $(".detail-block").css({
        "display" : 'none'
    });
});

function show(args) {
    var html = '';
    for(var i = 0, num = args.length; i < num; i++) {
        if(args[i].type == 6 || args[i].type == 10 || args[i].type == 11) {
            continue;
        }
        html += '<li><span class="token">' + args[i].token
                    + '</span><span class="badge">'
                    +TYPE[args[i].type]
                    +'</span>'
                +'</li>';
    }
    return html;
}

function throttle(method,context) {
    clearTimeout(method.id);
    method.id = setTimeout(function(){
        method.call(context);
    },500);
}

function over() {
    var e = this.e;
    var offsetBottom = $(window).innerHeight() - e.clientY;
    var top = e.clientY;
    var content = '<div>'+ this.text+'</div><span>' + this.type + '</span>';

    if(offsetBottom < 100) {
        top = top- 100;
    }
    $(".detail-block").css({
        "display" : "flex",
        "left" : '30px',
        "top" : top + 'px'
    }).empty().append(content);
}
