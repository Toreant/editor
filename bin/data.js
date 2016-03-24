/**
 * Created by apache on 16-3-22.
 */
module.exports = function() {
    return {
        STATE : {
            "NORMAL" : 0,
            "IDENTIFIER" : 1,
            "ANNOTATION" : 2,
            "KEYWORDS" : 3,
            "SIGN" : 4,
            "STRING" : 5,
            "SPACE" : 6,
            "NUMBER" : 7,
            "SPECIAL" : 9,
            "NEWLINE" : 10,
            "END" : 11
        },
        SPECIAL_CHARS : [
            '#','!','<','>','/','[',']','{','}','\\','|','?','&','^','%','*',
            '+','=','-',';'
        ],
        KEYWORDS : [
            'int','char','if','else','include','cin','cout','main','swtich','case',
            'class','enum','bool','short','string','use','namespace','struct','void',
            'while','for','do','new'
        ],
        SPACE : [' ', '\t'],
        transformChar : {
            't' : '\t',
            'n' : '\n',
            '\'' : '\'',
            '\"' : '\"',
            '\\' : '\\'
        }
    };
};