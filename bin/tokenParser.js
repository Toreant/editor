/**
 * Created by apache on 16-3-22.
 */
var _ = require('underscore');
var signArr = [
    "+", "-", "*", "/", "%",
    ">", "<", ">=", "<=", "=", "!=", "==", "=~",
    "+=", "-=", "*=", "/=", "%=",
    "&&", "||", "!", "^",
    "&&=", "||=", "^=",
    "<<", ">>", "->", "<-",
    "?", ":",
    ".", ",", ";", "..",
    "(", ")", "[", "]", "{", "}",
    "@", "@@", "$","#"
];

var signSet = [],maxLength =1 ,minLength = 1;


/**
 * 获取sign集（符号开头）
 */
function getSignSet() {
    for(var i = 0, num = signArr.length; i < num; i++) {
        var length = signArr[i].length;
        if(length > maxLength) {
            maxLength = length;
        }
        if(length < minLength) {
            minLength = length;
        }
        signSet.push(signArr[i][0]);
    }
}

/**
 * 匹配最长的标点符号
 * @param starIndex　开始的位置
 * @param str
 * @returns {{matchStr: string, newStarIndex: *}}
 */
function match(starIndex,str) {
    var matchStr = '';
    var length = str.length - starIndex;
    if(length >= minLength) {
        // 从字符串的尾部向前迭代，寻找最长匹配的sign
        for(var i = length - minLength; i >= 0; i--) {
            matchStr = str.substr(starIndex,i +1);
            if(_.indexOf(signArr,matchStr) != -1) {

                // 在signArr集中，就是当前所能匹配的最长sign
                break;
            }
            matchStr = '';
        }
    }

    return {
        matchStr : matchStr,
        newStarIndex : starIndex + i +1
    };
}

function TokenParser() {
    getSignSet();
}

TokenParser.prototype.isSignChar = function(c) {

    // 字符c是否signArr集中的开头字符
    return _.indexOf(signSet,c) != -1;
};

TokenParser.prototype.getSignByStr = function(str) {
    var startIndex = 0;
    var list = [];
    while(true) {
        if(startIndex >= str.length) {
            break;
        }
        var item = match(startIndex,str);
        list.push(item.matchStr);
        startIndex = item.newStarIndex;
    }
    return list;
};


module.exports = TokenParser;