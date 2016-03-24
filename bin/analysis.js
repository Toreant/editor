/**
 * Created by apache on 16-3-22.
 */
'use strict';
var _ = require('underscore');
var TokenParser = require('./tokenParser');
var tokenParser = new TokenParser();
var data = require('./data')();
var STATE = data.STATE,
    transformChar = data.transformChar,
    KEYWORD = data.KEYWORDS,
    SPACE = data.SPACE;


function isInclude(arr,str) {
    var included = false;
    for(var i = 0, num = arr.length; i < num; i++) {
        if(arr[i] === str) {
            included = true;
            break;
        }
    }
    return included;
}

function Analysis() {

    this.state = STATE.NORMAL;
    this.renderStr = "";
    this.transferredMean = false;
    this.str = [];

    this.createToken = function(createTokenType) {
        this.str.push({ token : this.renderStr, type : createTokenType});
        this.renderStr = '';
    };

    this.createTokenByList = function(createTokenType,list) {
        for(var i = 0, num = list.length; i < num; i++) {
            this.str.push({token : list[i],type : createTokenType});
        }
    };

    this.readChar = function(c) {

        var moveCursor = true,
            createTokenType = -1; // 是否移动光标

        switch(this.state) {
            case STATE.NORMAL:
                if(this.identifierToStart(c)) {
                    this.state = STATE.IDENTIFIER;
                } else if(c == '\"' || c == '\'') {
                    this.state = STATE.STRING;
                } else if(tokenParser.isSignChar(c)) {
                    this.state = STATE.SIGN;
                } else if(!isNaN(c) && !/\s/.test(c)) {
                    this.state = STATE.NUMBER;
                } else if(isInclude(SPACE,c)) {
                    this.state = STATE.SPACE;
                } else if(c == '\n') {
                    createTokenType = STATE.NEWLINE;
                } else if(c == '\0') {
                    createTokenType = STATE.END;
                }

                this.renderStr += c;
                break;

            case STATE.IDENTIFIER:
                if(this.identifierToStart(c)) {
                    this.renderStr += c;
                } else {
                    this.state = STATE.NORMAL;
                    if(_.indexOf(KEYWORD,this.renderStr) != -1) {
                        createTokenType = STATE.KEYWORDS;
                    } else {
                        createTokenType = STATE.IDENTIFIER;
                    }
                    moveCursor = false;
                }
                break;

            case STATE.STRING:
                if(this.transferredMean) {
                    // 转义字符
                    var tmp = transformChar[c];
                    if(!tmp) {
                        throw new Error('error transform char');
                    }
                    this.renderStr += tmp;
                    this.transferredMean = false;
                } else if(c == '\\') {
                    this.transferredMean = true;
                } else {
                    this.renderStr += c;
                    if(c == '\'' || c == '\"') {
                        this.state = STATE.NORMAL;
                        createTokenType = STATE.STRING;
                    }
                }
                break;

            case STATE.ANNOTATION:
                if(c != '\n' || c != '\0') {
                    this.renderStr += c;
                } else {
                    this.state = STATE.NORMAL;
                    createTokenType = STATE.ANNOTATION;
                    moveCursor = false;
                }
                break;

            case STATE.KEYWORDS:
                break;

            case STATE.SIGN:
                if(tokenParser.isSignChar(c)) {
                    this.renderStr += c;
                } else {
                    var list = tokenParser.getSignByStr(this.renderStr);
                    var _index = _.indexOf(list,'//');
                    if(_index == -1) {
                        this.createTokenByList(STATE.SIGN,list);
                        this.renderStr = '';
                        this.state = STATE.NORMAL;
                        moveCursor = false;
                    } else {
                        this.state = STATE.ANNOTATION;
                    }
                }
                break;

            case STATE.SPACE:
                if(/\s/.test(c)) {
                    this.renderStr += c;
                } else {
                    this.state = STATE.NORMAL;
                    createTokenType = STATE.SPACE;
                    moveCursor = false;
                }
                break;

            case STATE.NUMBER:
                if(!isNaN(c) && !/\s/.test(c)) {
                    this.renderStr += c;
                } else {
                    createTokenType = STATE.NUMBER;
                    this.state = STATE.NORMAL;
                    moveCursor = false;
                }
                break;

            case STATE.SPECIAL:
                if(c == '//') {
                    console.log('dsd');
                    this.state = STATE.ANNOTATION;
                } else if(c == '*') {
                    this.state = STATE.ANNOTATION;
                } else {
                    this.state = STATE.NORMAL;
                }
                break;

            default:
                createTokenType = STATE.END;
        }

        if(createTokenType != -1) {
            this.createToken(createTokenType);
        }

        return moveCursor;
    };

    this.identifierToStart = function(c) {

        // 判断是否是标识符的开始符号
        return (c >= 'a' && c <= 'z') || (c >='A' && c <= 'Z') || c == '_';
    };

    this.render = function(str) {
        for(var i = 0, len = str.length; i <= len; i++) {

            if(!this.readChar(str[i])) {
                i--;
            }
        }
        return this.str;
    };
}

module.exports = Analysis;