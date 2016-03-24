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

var signSet = [],maxLength =3 ,minLength = 1;

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

function match(starIndex,str) {
    var matchStr = '';
    var length = str.length - starIndex;
    if(length >= minLength) {
        for(var i = length - minLength; i >= 0; i--) {
            matchStr = str.substr(starIndex,i +1);
            if(_.indexOf(signArr,matchStr) != -1) {
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