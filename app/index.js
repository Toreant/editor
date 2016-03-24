/**
 * Created by apache on 16-3-22.
 */

var $ = require('./jquery.min');
var ipc = require("electron").ipcRenderer;
var $code = $("#code"),
    $aside = $(".mAside");

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
    11 : "结束标志"
};

var scanBtn = document.getElementById('scan');

scanBtn.addEventListener('click',function(e) {
    var code = $code.text();

    ipc.send('edit-scan',code);
});

scanBtn.addEventListener('mouseover',function(e) {
    $(".tip").fadeIn();
});

$code.on('input',function(e) {
    var input = $(this).val().split(/\n/);
    $('.line').css('transform','translateY(-'+$(this).scrollTop()+'px)');
    $(".line").empty();
    for(var i = 0, num = input.length; i < num; i++) {
        var $line = $('.line');
            var lineNum = $line.children('span').length;
            var newNum = '<span class="line-num">' + (i+1) +'</span>';
            $(".line").append(newNum);
    }
});

ipc.on('code-receive',function(event,args) {
    $(".token-list").empty().append(show(args));
    $aside.animate({'right': '0'},400);
    console.log(args);
});

$(".backBtn").click(function() {
    $aside.animate({'right':'-100%'},400);
});

$code.on('scroll',function(e) {
    $('.line').css('transform','translateY(-'+$(this).scrollTop()+'px)');
});

function show(args) {
    var html = '';
    for(var i = 0, num = args.length; i < num; i++) {
        if(/\s/.test(args[i].token)) {
            continue;
        }
        html += '<li>' + args[i].token
                    + '<span class="badge">'
                    +TYPE[args[i].type]
                    +'</span>'
                +'</li>';
    }
    return html;
}
