String.prototype.IsTelephone = function () {
    myReg = /^[0-9]{7,}$|^[0-9]{3,}-[0-9]{7,}$|^[0-9]{3,4}-[0-9]{3,}-[0-9]{4,}$/;
    if (myReg.test(this)) return true;
    return false;
}
String.prototype.IsEmail = function () {
    var myReg = /[\u4e00-\u9fa5]/;
    if (!myReg.test(this)) {
        myReg = /^[_a-zA-Z0-9][-._a-zA-Z0-9]*@[-._a-zA-Z0-9]+\.[-._a-zA-Z0-9]+(\.[-._a-zA-Z])*$/;
        if (myReg.test(this)) return true;
    } else {
        myReg = /^[_a-zA-Z0-9\u4e00-\u9fa5][-_.a-zA-Z0-9\u4e00-\u9fa5]*@[-._a-zA-Z0-9\u4e00-\u9fa5]+(\.[-._0-9a-zA-Z\u4e00-\u9fa5]+)*$/;
        if (myReg.test(this)) return true;
    }
    return false;
}

function setCookie(name, value) {
    var today = new Date();
    var expires = new Date();
    expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 365);
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString();
}

function getCookie(name, type) {
    var search = name + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length
            end = document.cookie.indexOf(";", offset)
            if (end == -1) {
                end = document.cookie.length;
            }
            if (type == 'u') {
                return unescape(document.cookie.substring(offset, end));
            }
            return decodeURI(document.cookie.substring(offset, end));
        }
    }
    return "";
}

function checkCookie() {
    var timestamp = new Date().getTime();
    setCookie('sup_cookie', timestamp);
    if (timestamp != getCookie('sup_cookie')) {
        return false;
    }
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
    return true;
}

function getUrlParams(param, url) {
    if (url == undefined) {
        url = location.search;
    }
    var params_arr = url.split('&');
    for (var i = 0; i < params_arr.length; i++) {
        if (params_arr[i].indexOf(param) != -1) {
            var temp = params_arr[i].split('=');
            return temp[1];
        }
    }
    return '';
}

function UrlEncode(text) {
    return encodeURIComponent(text);
}

function msgFilter(msg) {
    for (var i = 1; i < 32; i++) {
        special_char = String.fromCharCode(i);
        if (msg.indexOf(special_char) != -1 && (i != 13 && i != 10)) {
            reg_special = new RegExp(special_char, "ig");
            msg = msg.replace(reg_special, "");
        }
    }
    while (/onerror|onclick|onload|onmouse|onkey|unescape|decodeuri|eval|expression|\\/igm.test(msg)) {
        msg = msg.replace(/onerror|onclick|onload|onmouse|onkey|unescape|decodeuri|eval|expression|\\/igm, '');
    }
    return msg;
}

function isJsLink(msg) {
    var href_link = msg.match(/\[.[url|URL].=[A-Za-z0-9].*?\].*?\[\/.[url|URL].\]/g);
    if (href_link) {
        var href_url = msg.toLowerCase().match(/\[.[url|URL].=.*?\]/g);
        if (href_url) {
            var href_len = href_url.length;
            for (var i = 0; i < href_len; i++) {
                var href_java = href_url[i].match(/javascript:/g);
                if (href_java) return true;
            }
        }
    }
    return false;
}

function HtmlEncode(text) {
    var msg = text.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/\'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    msg = msg.replace(/\r\n/g, "<br/>");
    msg = msg.replace(/\r|\n/g, "<br/>");
    return msg;
}

function HtmlDecode(text) {
    var msg = text.replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&#039;/g, '\'').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&mdash;/g, '—');
    msg = msg.replace(/<br\/>/g, '\n');
    return msg;
}

function UBBEncode(str) {
    str = str.replace(/<img[^>]*src=[\'\"\s]*[^\s\'\"]+img\/face\/([^\s\'\"]+)\/([^\s\'\".]+)[^>]*>/ig, function ($1, $2, $3) {
        var face_code = "{" + $2 + "#" + $3.split('_')[1] + "#}";
        return face_code;
    });
    str = str.replace(/<img[^>]*smile=\"(\d+)\"[^>]*>/ig, '[s:$1]');
    str = str.replace(/<img[^>]*src=[\'\"\s]*([^\s\'\"]+)[^>]*>/ig, function ($1, $2) {
        if ($2.substr(0, 2) == '//') return '[IMG]' + http_pro + $2.substr(2) + '[/IMG]';
        if ($2.indexOf('http://') == -1 && $2.indexOf('https://') == -1) {
            if ($2.indexOf(host) == -1) {
                return '[IMG]' + http_pro + host + $2 + '[/IMG]';
            }
        }
        return '[IMG]' + $2 + '[/IMG]';
    });
    var apattern = new RegExp(/<a[^>]*href=[\'\"\s]*([^\s\'\"]*)[^>]*>(.+?)<\/a>/i);
    if (apattern.test(str) == true) {
        str = str.replace(/<a[^>]*href=[\'\"\s]*([^\s\'\"]*)[^>]*>(.+?)<\/a>/ig, '[URL=' + '$1' + ']' + '$2' + '[/URL]');
        return UBBEncode(str);
    }
    var urlList = [];
    var imgList = [];
    if (str.indexOf("[IMG") != -1 || str.indexOf("[img") != -1) {
        var imgpattern = /\[IMG\](https:\/\/|http:\/\/)?(.+?)\[\/IMG\]/gim;
        str = str.replace(imgpattern, function (img) {
            imgList.push(img);
            img = "[HZ6D_IMG_" + (imgList.length - 1) + "]";
            return img;
        });
    }
    if (str.indexOf("[URL") != -1 || str.indexOf("[url") != -1) {
        var pattern = /\[URL\=([^\]]*)\](.+?)\[\/URL\]/gim;
        str = str.replace(pattern, function (url) {
            urlList.push(url);
            url = "[HZ6D_URL_" + (urlList.length - 1) + "]";
            return url;
        });
    }
    var re = /\[voice\].+\[\/voice\]/;
    if (!re.test(str)) {
        str = "!" + str;
        var pattern = /([^{\/])(((ftp|http|https):\/\/)?([\w-]+@[\w-]+\.)+(hk|com|cn|info|net|org|me|top|tw|tv|xyz)([\/\?][\w!~;*'()&=\+\$%\-\/\#\?:\.,\|\^]*)?)/gim;
        if (!pattern.test(str)) {
            var pattern = /([^{\/])(((ftp|http|https):\/\/)?([\w-]+\.)+(hk|com|cn|info|net|org|me|top|tw|tv|xyz)([\/\?][\w!~;*'()&=\+\$%\-\/\#\?:\.,\|\^]*)?)/gim;
            str = str.replace(pattern, "$1[URL=$2]$2[/URL]");
        }
        str = str.replace('!', '');
    }
    if (str.indexOf("[URL") != -1 || str.indexOf("[url") != -1) {
        var pattern = /\[URL\=([^\]]*)\]([^\[]*)\[\/URL\]/gim;
        str = str.replace(pattern, function (url) {
            urlList.push(url);
            url = "[HZ6D_URL_" + (urlList.length - 1) + "]";
            return url;
        });
    }
    str = str.replace(/\[URL=www/gi, "[URL=" + http_pro + "www");
    var reg = new RegExp(/[\d]+(1(3[0-9]|4[5-9]|5[012356789]|6[567]|7[0-9]|8[0-9]|9[015789])\d{8})(?!\d)+/gi);
    if (!reg.test(str)) {
        str = str.replace(/[^\d]?(1(3[0-9]|4[5-9]|5[012356789]|6[567]|7[0-9]|8[0-9]|9[015789])\d{8})(?!\d)+/gi, function (mobi) {
            var tmp1 = mobi.replace(/\D/gi, ''), tmp2 = mobi.replace(/\d/gi, '');
            mobi = tmp2 + '[MOBILE]' + tmp1 + '[/MOBILE]';
            return mobi;
        });
    }
    var reg2 = new RegExp(/[\d]+0(\d{2,3}-?\d{7,8})(?!\d)+/gi);
    if (!reg2.test(str)) {
        str = str.replace(/([^\d])?(0(\d{2,3}-?\d{7,8}))(?!\d)+/gi, function ($1, $2, $3) {
            var tmp = $1.replace($3, '');
            var phone = tmp + '[PHONE]' + $3 + '[/PHONE]';
            return phone;
        });
    }
    if (urlList.length > 0) {
        var i = 0;
        str = str.replace(/(\[HZ6D_URL_)(\d)+(\])/gi, function (url) {
            url = urlList[i];
            i++;
            return url;
        });
    }
    if (imgList.length > 0) {
        var i = 0;
        str = str.replace(/(\[HZ6D_IMG_)(\d)+(\])/gi, function (img) {
            img = imgList[i];
            i++;
            return img;
        });
    }
    str = str.replace(/((\w-*\.*)+@(\w-?)+(\.\w{2,})+)/gi, "[EMAIL]$1[/EMAIL]");
    return str;
}

function UBBCode(strContent) {
    if ((navigator.appName == "Microsoft Internet Explorer") && (navigator.appVersion.match(/MSIE \d\.\d/) == "MSIE 5.0")) {
        if (strContent.indexOf("[IMG]") >= 0) {
            var con = strContent.substr(5, strContent.indexOf("[/IMG]") - 5);
            strContent = "<IMG SRC=\"" + con + "\">";
        }
        if (strContent.indexOf("[URL=") >= 0) {
            var tlink = strContent.substr(5, strContent.indexOf("]") - 5);
            var text = strContent.substr(strContent.indexOf("]") + 1, strContent.length - 6 - strContent.indexOf("]") - 1);
            strContent = "<A HREF=\"" + tlink + "\" TARGET=_blank>" + text + "</A>";
        }
        if (strContent.indexOf("[MOBILE]") >= 0) {
            var tlink = strContent.substr(8, strContent.indexOf("[/MOBILE]") - 8);
            strContent = text;
        }
        if (strContent.indexOf("[PHONE]") >= 0) {
            var tlink = strContent.substr(7, strContent.indexOf("[/PHONE]") - 7);
            strContent = text;
        }
        if (strContent.indexOf("[EMAIL]") >= 0) {
            var tlink = strContent.substr(7, strContent.indexOf("[/EMAIL]") - 7);
            strContent = text;
        }
    } else {
        var r2 = new RegExp("(\\[URL=(.+?)\])(.+?)(\\[\\/URL\\])", "gim");
        var r3 = new RegExp("(\\[IMG\])(\\S+?)(\\[\\/IMG\\])", "gim");
        var r4 = new RegExp("(\\[QQ\])(\\d+?)(\\[\\/QQ\\])", "gim");
        var r5 = new RegExp("&amp", "gim");
        var r6 = new RegExp("(\\[MOBILE\])(\\d+?)(\\[\\/MOBILE\\])", "gim");
        var r7 = new RegExp("(\\[PHONE\])([\\d\\-]+?)(\\[\\/PHONE\\])", "gim");
        var r8 = new RegExp("(\\[EMAIL\])(\\S+?)(\\[\\/EMAIL\\])", "gim");
        var r9 = new RegExp("(\\[voice\])(\\S+?)(\\[\\/voice\\])", "gim");
        strContent = strContent.replace(r2, function ($1, $2, $3, $4, $5) {
            if ($3.indexOf('http://') == -1 && $3.indexOf('https://') == -1) {
                $3 = http_pro + $3;
            }
            return '<A HREF="' + $3 + '" TARGET="_blank" style="text-decoration:underline; color:inherit;">' + $4 + '</A>';
        });
        strContent = strContent.replace(r3, '<IMG border="0" SRC="$2">');
        strContent = strContent.replace(r4, '<img border="0" title="点击跟我QQ[$2]聊" src="http://www.53kf.com/img/qq.gif" onclick="addQQ(\'$2\')" style="cursor:pointer"/>[$2]');
        strContent = strContent.replace(r6, '$2');
        strContent = strContent.replace(r7, '$2');
        strContent = strContent.replace(r8, '$2');
        strContent = strContent.replace(r9, function ($1, $2, $3) {
            try {
                audio_num++;
                audio_vars['audio_' + audio_num] = new BenzAMRRecorder();
                audio_vars['audio_' + audio_num].initWithUrl($3);
                return '<div class="audiobtn" id="audio_' + audio_num + '"><span class="audio_log" alt=""><span></div>';
            } catch (e) {
                return '<div class="audiobtn unaudio_play"><span class="audio_log" alt=""><span></div>';
            }
        });
    }
    strContent = strContent.replace(/\{(.[^#.-\/]*)#(.[^#.-\/]*)#\}/gi, function ($1, $2, $3) {
        return "<img class='img_53kf_face' src=\"" + http_pro + host + "/img/face/" + $2 + "/" + $2.replace('_min', '') + "_" + $3 + ".gif?8\" border=\"0\">";
    });
    return strContent;
}

function strToObj(str) {
    var tmp = new Object();
    var tmp2 = new Object();
    var ret = new Object();
    tmp = str.split(";");
    for (var i = 0; i < tmp.length; i++) {
        tmp2 = tmp[i].split(":");
        ret[tmp2[0]] = tmp2[1];
    }
    return ret;
}

function getStringField(str, deli, pos) {
    arr = str.split(deli);
    if (arr.length >= pos) {
        return arr[pos - 1];
    } else {
        return "";
    }
}

function getBrowserType() {
    if (!!window.ActiveXObject || ("ActiveXObject" in window)) {
        return 'IE';
    }
    if (navigator.userAgent.indexOf('Firefox') != -1) {
        return 'Firefox';
    }
    if (navigator.userAgent.indexOf('TheWorld') != -1 || navigator.userAgent.indexOf('Edge') != -1 || navigator.userAgent.indexOf('MetaSr') != -1 || navigator.userAgent.indexOf('BIDUBrowser') != -1 || navigator.userAgent.indexOf('QQBrowser') != -1) {
        return 'other';
    }
    if (navigator.userAgent.indexOf('Chrome') != -1) {
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
            if (mimeTypes[mt]['type'] == 'application/vnd.chromium.remoting-viewer') {
                return '360';
            }
        }
        return 'Chrome';
    }
}

function getPcOs() {
    if (navigator.userAgent.indexOf("Window") > 0) {
        return "Windows";
    } else if (navigator.userAgent.indexOf("Mac OS X") > 0) {
        return "Mac";
    } else if (navigator.userAgent.indexOf("Linux") > 0) {
        return "Linux";
    } else {
        return "NUll";
    }
}

function getTime() {
    var dd = new Date();
    return Math.floor(dd.getTime() / 1000);
}

function getTime2() {
    var date = new Date();
    var hour = "000" + date.getHours();
    var min = "000" + date.getMinutes();
    var sec = "000" + date.getSeconds();
    hour = hour.substr(hour.length - 2);
    min = min.substr(min.length - 2);
    sec = sec.substr(sec.length - 2);
    return hour + ":" + min + ":" + sec;
}

function snapshot_fun(type) {
    var time_later = 1;
    if (type == 'hide') {
        try {
            top.postMessage('53kf_min_window', '*');
            time_later = 200;
        } catch (e) {
        }
    }
    setTimeout(function () {
        window.snapShot_obj = document.getElementById('snapShot_obj');
        snapShot_obj.host = snapshot_host;
        snapShot_obj.id6d = snapshot_rand_num;
        snapShot_obj.start();
    }, time_later);
}

function ocx_callback(a, b, c) {
    try {
        top.postMessage('53kf_show_window', '*');
    } catch (e) {
    }
    if (a == 200) {
        var img_url = 'http://' + snapshot_host + '/upload/snapshot/' + b + '/' + c;
        var urlcode = '[IMG]' + img_url + '[/IMG]';
        to_insert_img_obj.sendimgmsg(urlcode);
    }
}

function insert_snapshot3(host, rand_num, type) {
    if ($(".line-up").css("display") == 'block') return;
    if (window.ActiveXObject || ("ActiveXObject" in window)) {
        if (document.getElementById('plugin_snapshot').innerHTML) {
            snapshot_fun(type);
        } else {
            var plusCheck = false;
            try {
                new ActiveXObject('KFIESNAPSHOT.KfIESnapshotCtrl.1');
                plusCheck = true;
            } catch (e) {
                var new_window_left = (window.screen.width - 800) / 2;
                window.open('/download/snapshot_show.php', 'newwindow', 'height=' + window.screen.availHeight + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                return;
            }
            snapshot_host = host;
            snapshot_rand_num = rand_num;
            if (plusCheck) {
                var ss = '';
                ss += '<object id="snapShot_obj" name="snapShot_obj" classid="clsid:4CC32CB3-E6D8-4042-8A69-5C7783B977D0" codebase="http://' + host + '/download/KFIESnapShot_v1.1.exe#version=1,0,0,2"></object>';
                document.getElementById('plugin_snapshot').innerHTML = ss;
                setTimeout(snapshot_fun(type), 500);
            }
        }
        return;
    }
    if (navigator.userAgent.indexOf('Chrome') != -1) {
        if (navigator.userAgent.indexOf('TheWorld') != -1 || navigator.userAgent.indexOf('Edge') != -1 || navigator.userAgent.indexOf('MetaSr') != -1 || navigator.userAgent.indexOf('BIDUBrowser') != -1 || navigator.userAgent.indexOf('QQBrowser') != -1) {
            var new_window_left = (window.screen.width - 800) / 2;
            var new_window_height = window.screen.availHeight - 80;
            window.open('/download/snapshot_show.php?browser=other', 'newwindow', 'height=' + new_window_height + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
            return;
        }
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
            if (mimeTypes[mt]['type'] == 'application/vnd.chromium.remoting-viewer') {
                var new_window_left = (window.screen.width - 800) / 2;
                var new_window_height = window.screen.availHeight - 80;
                window.open('/download/snapshot_show.php?browser=other', 'newwindow', 'height=' + new_window_height + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                return;
            }
        }
        var chrome_version = navigator.userAgent.substr(navigator.userAgent.indexOf('Chrome') + 7, 2);
        if (chrome_version >= 45) {
            var CrxEventFlag = 'myKfCapturteCustomEvent';
            var objFlag = document.getElementById(CrxEventFlag);
            if (objFlag === null) {
                window.open('/download/snapshot_show.php?browser=other', 'newwindow', 'height=' + new_window_height + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                return;
            }
            if (!chrome_event_bind) {
                snapshot_host = host;
                document.addEventListener('CaptureEventCallBack', function (evt) {
                    var _aoResult = evt.detail;
                    ocx_callback(_aoResult.state, _aoResult.fpath, _aoResult.fname);
                });
                chrome_event_bind = true;
            }
            if (type == 'hide') {
                try {
                    top.postMessage('53kf_min_window', '*');
                } catch (e) {
                }
            }
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent('myKfCapturteCustomEvent', true, false, '{"host":"' + host + '","id6d":"' + rand_num + '"}');
            document.dispatchEvent(evt);
        } else {
            if (document.getElementById('plugin_snapshot').innerHTML) {
                try {
                    snapshot_fun(type);
                    ocx_callback(snapShot_obj.state, snapShot_obj.fpath, snapShot_obj.fname);
                } catch (e) {
                    alert(e);
                }
            } else {
                var ss = '';
                ss += '<embed id="snapShot_obj" type="application/snapshot-plugin" width=0 height=0></embed>';
                document.getElementById('plugin_snapshot').style.display = 'block';
                document.getElementById('plugin_snapshot').innerHTML = ss;
                snapshot_host = host;
                snapshot_rand_num = rand_num;
                try {
                    snapshot_fun(type);
                    ocx_callback(snapShot_obj.state, snapShot_obj.fpath, snapShot_obj.fname);
                } catch (e) {
                    var new_window_left = (window.screen.width - 800) / 2;
                    var new_window_height = window.screen.availHeight - 80;
                    window.open('/download/snapshot_show.php?browser=other', 'newwindow', 'height=' + new_window_height + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                }
            }
        }
        return;
    }
    var new_window_left = (window.screen.width - 800) / 2;
    var new_window_height = window.screen.availHeight - 80;
    window.open('/download/snapshot_show.php?browser=other', 'newwindow', 'height=' + new_window_height + ', width=800, top=0, left=' + new_window_left + ', menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
};var code_key = '';

function verifyCode(res, event) {
    var e = event || window.event;
    mouse = new MouseEvent(e);
    if (res.guestid < 0) res.guestid = 0;
    var xpos = mouse.x;
    var ypos = mouse.y;
    var url = http_pro + "imgcode.53kf.com/imgcode.jsp";
    var str = "action=CODE&operate=verify_code";
    str += "&pictureid=" + res.pictureid;
    str += "&from=" + res.from;
    str += "&guestid=" + res.guestid;
    str += "&companyid=" + res.companyid;
    str += "&time=" + Date.parse(new Date());
    str += "&xpos=" + xpos;
    str += "&ypos=" + ypos;
    refreshcode('POST', url, str);
}

function callBackCode(res) {
    if (res.result === "success") {
        var char = 'char' + res.times;
        $("#" + char).attr("style", "font-weight:bold;color:red;width:10%;font-size:medium;background:#FFF;border:0px;");
        if (res.times == 1) {
            code_key = res.code_key;
            destroyCodeDiv();
            checkCodeSuccess(res.vcode);
        }
    } else {
        if (res.status == 2)
            alert("验证失败。重新点击。"); else
            alert("验证超时。重新点击。");
        fireCode_img(res.pictureid, res.from, res.type, res.guestid, res.companyid);
    }
}

function createCodeFreeze(guestid, from, company_id) {
    fireCode_img("", from, undefined, guestid, company_id);
}

function createCodeValidateDiv(height, width, res) {
    var validate_str = document.createElement("div");
    validate_str.id = "code_div";
    validate_str.style.width = "300px";
    validate_str.style.height = "225px";
    validate_str.style.position = "absolute";
    validate_str.style.fontSize = "12px";
    validate_str.style.textAlign = "center";
    validate_str.style.backgroundColor = "#FFF";
    validate_str.style.zIndex = 9999;
    var str = '<img style="margin:10px;" id="code_img" alt="正在加载..." src="img/loadingcode.gif">';
    str += '<div style="text-align:center;position:absolute;bottom:20%;width:100%;padding-top:15px;margin:0 auto;text-align:center;">';
    str += '<font size="3px" style="margin-left:5px;font-weight:normal;">依次点击图中的: </font>';
    str += '<label id="char0" style="height;10px;width:35px;font-size:medium;background:#FFF;border:0px;display:inline-block;*display:inline;*zoom:1;" border="0">"&quot;' + decodeURI(res.char0) + '&quot;"';
    str += '</label>';
    str += '、';
    str += '<label id="char1" style="height;10px;width:35px;font-size:medium;background:#FFF;border:0px;display:inline-block;*display:inline;*zoom:1;" border="0">"&quot;' + decodeURI(res.char1) + '&quot;"';
    str += '</label>';
    str += '</div>';
    str += '<div style="margin:0 auto;margin-left:10%;position:absolute;bottom:7%;width:80%;border:1px solid #ccc;height:0px;">';
    str += '</div>';
    str += '<a id="code_refresh" onmouseover="btnchange();" class="code_refresh_1" onclick="fireCode_img(\'' + res.pictureid + '\', \'' + res.from + '\', \'' + res.type + '\', \'' + res.guestid + '\', \'' + res.companyid + '\')" title="刷新验证码">';
    str += '</a>';
    validate_str.innerHTML = str;
    var validate_freeze = document.getElementById("validate_freeze");
    document.body.insertBefore(validate_str, validate_freeze);
    replaccode(res);
}

function createCodeValidateFreeze(id, top, left, height, width) {
    var voteFreezeDiv = document.createElement("div");
    voteFreezeDiv.id = id;
    voteFreezeDiv.style.top = top + "px";
    voteFreezeDiv.style.left = left + "px";
    voteFreezeDiv.style.height = height + "px";
    voteFreezeDiv.style.width = width + "px";
    voteFreezeDiv.style.border = "none";
    voteFreezeDiv.style.position = "absolute";
    voteFreezeDiv.style.backgroundColor = "#000";
    voteFreezeDiv.style.margin = 0;
    voteFreezeDiv.style.padding = 0;
    voteFreezeDiv.style.zIndex = 9998;
    voteFreezeDiv.style.opacity = "0.2";
    voteFreezeDiv.style.filter = "alpha(opacity=20)";
    voteFreezeDiv.style.duration = 1000;
    voteFreezeDiv.innerHTML = "<div style='position:absolute;z-index:-1;left:-1px;top:0;width:100%;height:100%;'><iframe style='background:#000;width:100%;height:100%;filter:alpha(opacity=0);-moz-opacity:0;' frameborder='0'></iframe></div>";
    document.body.insertBefore(voteFreezeDiv, document.body.firstChild);
}

function fireCode_img(pictureid, from, type, guestid, company_id) {
    var url = http_pro + "imgcode.53kf.com/imgcode.jsp";
    var str = "action=CODE&operate=get_code";
    str += "&type=" + type;
    str += "&guestid=" + guestid;
    str += "&pictureid=" + pictureid;
    str += "&from=" + from;
    str += "&companyid=" + company_id;
    str += "&time=" + Date.parse(new Date());
    refreshcode('POST', url, str);
}

function refreshcode(action, url, str) {
    $.ajax({
        url: url, data: str, dataType: 'jsonp', jsonp: 'callback', timeout: 3000, success: function (res) {
            if (res.action == 'codeInfo') {
                codeInfo(res);
            } else if (res.action == 'callBackCode') {
                callBackCode(res);
            }
        }, error: function () {
            checkCodeError();
        }
    });
}

function codeInfo(res) {
    var obj = document.getElementById("validate_freeze");
    if (obj != null) {
        replaccode(res);
    } else {
        var height = document.body.clientHeight;
        var width = document.body.clientWidth;
        createCodeValidateFreeze("validate_freeze", 0, 0, height, width);
        createCodeValidateDiv(height, width, res);
    }
}

function replaccode(res) {
    var src = http_pro + "imgcode.53kf.com/imgcode.jsp";
    src += "?action=CODE";
    src += "&guestid=" + res.guestid;
    src += "&pictureid=" + res.pictureid;
    src += "&from=" + res.from;
    src += "&operate=show_code";
    src += "&codeid=" + res.codeid;
    src += "&companyid=" + res.companyid;
    src += "&time=" + new Date().getTime();
    $("#code_img").attr("src", src);
    $("#code_img").unbind('click').bind("click", {res: res}, function (event) {
        verifyCode(res, event);
    });
    $("#char0").html('"' + decodeURI(res.char0) + '"');
    $("#char1").html('"' + decodeURI(res.char1) + '"');
    $("#char0").attr("style", "width:10%;font-size:medium;background:#FFF;border:0px;");
    $("#char1").attr("style", "width:10%;font-size:medium;background:#FFF;border:0px;");
}

function btnchange() {
    var bg = document.getElementById("code_refresh");
    bg.onmouseover = function () {
        this.setAttribute("className", "code_refresh_2");
        this.setAttribute("class", "code_refresh_2");
    }
    bg.onmouseout = function () {
        this.setAttribute("className", "code_refresh_1");
        this.setAttribute("class", "code_refresh_1");
    }
    bg.onmousedown = function () {
        this.setAttribute("className", "code_refresh_3");
        this.setAttribute("class", "code_refresh_3");
    }
    bg.onmouseup = function () {
        this.setAttribute("className", "code_refresh_1");
        this.setAttribute("class", "code_refresh_1");
    }
}

function destroyCodeDiv() {
    var obj = document.getElementById("validate_freeze");
    obj.parentNode.removeChild(obj);
    obj = document.getElementById("code_div");
    obj.parentNode.removeChild(obj);
}

function MouseEvent(e) {
    var p = $("#code_img");
    var position = p.position();
    var positionX = e.pageX - p.offset().left || e.clientX
        - p.offset().left || e.layerX - p.offset().left;
    this.x = positionX;
    var positionY = e.pageY - p.offset().top || e.clientY
        - p.offset().top || e.layerY - p.offset().top;
    this.y = positionY;
}

$(function () {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "../css/code.css";
    document.getElementsByTagName("head").item(0).appendChild(link);
});
CONST_TYPE_MODE_WITHOUT_MSG = 0;
CONST_TYPE_MODE_WITH_MSG = 1;
CONST_LNK_TYPE_ALWAYS_NEW = 0;
CONST_LNK_TYPE_KEEP_EXIST = 1;

function XMLGetNodes(xmlDoc, tagName) {
    try {
        return (null == xmlDoc) ? null : xmlDoc.getElementsByTagName(tagName);
    } catch (e) {
        return null;
    }
}

function XMLGetNode(nodeList, i) {
    try {
        return (null == nodeList) ? null : nodeList.item(i);
    } catch (e) {
        return null;
    }
}

function XMLGetNamedAttr(node, attrName) {
    try {
        return (null == node) ? '' : node.attributes.getNamedItem(attrName).value;
    } catch (e) {
        return '';
    }
}

function XMLGetNodesLength(nodeList) {
    try {
        return (null == nodeList) ? 0 : nodeList.length;
    } catch (e) {
        return 0;
    }
}

function XMLCheckStatus(url) {
    try {
        var ajax = new CXMLRequest().GetXmlHttp();
        ajax.open("HEAD", url, false);
        ajax.send();
        return ajax.status;
    } catch (e) {
        return 9999;
    }
}

function GetPostDataValue(postData, position) {
    return getStringField(getStringField(postData, '&', position), '=', 2);
}

function CXMLRequest(tag, client) {
    this.m_tag = tag;
    this.m_client = client;
    this.m_url = "";
    this.m_postData = "";
    this.m_isSubmit = false;
    this.m_xmlHttp = null;
    this.m_retryNum = 1;
    if (typeof CXMLRequest._initialized == 'undefined') {
        var myProto = CXMLRequest.prototype;
        myProto.CreateAjax = function () {
            var me = this;
            if (window.XMLHttpRequest) {
                this.m_xmlHttp = new XMLHttpRequest();
            } else {
                this.m_xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            this.m_xmlHttp.onreadystatechange = function () {
                me.AjaxHandler();
            }
        }
        myProto.AjaxHandler = function () {
            var me = this;
            if (4 == this.m_xmlHttp.readyState) {
                if (200 == this.m_xmlHttp.status) {
                    this.m_client.RequestHandler(me);
                    this.m_xmlHttp = null;
                    me = null;
                } else {
                    var cmdArray = ['LNK', 'REG', 'QST', 'FIL', 'SRV', 'NAM', 'NTS', 'TIP', 'STE', 'ITK', 'IFIL', 'GET', 'ULN'];
                    if (/cmd=([^&]+)/.test(this.m_postData) && cmdArray.indexOf(RegExp.$1) >= 0) {
                        if (this.m_retryNum > 0) {
                            this.m_retryNum--;
                            this.Repost();
                        } else {
                            this.m_client.RequestHandler(me);
                        }
                    }
                }
            }
        }
        myProto.SendReq = function (cmd) {
            if (location.href.indexOf('webCompany_bg.php?') > -1) this.AddPostData('rnd', page_rnd);
            if (!this.m_isSubmit) {
                this.m_xmlHttp.open("POST", this.m_url, true);
                this.m_xmlHttp.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
                this.m_xmlHttp.send(this.m_postData);
                this.m_isSubmit = true;
            }
        }
        myProto.SetURL = function (URL) {
            if ("" == this.m_url) {
                this.m_url = URL + '?_=' + new Date().getTime();
            }
        }
        myProto.AddPostData = function (name, value) {
            this.m_postData += name + "=" + value + "&";
        }
        myProto.SetPostData = function (value) {
            this.m_postData = value;
        }
        myProto.GetPostData = function (value) {
            return this.m_postData;
        }
        myProto.GetTag = function () {
            return this.m_tag;
        }
        myProto.GetXmlHttp = function () {
            return this.m_xmlHttp;
        }
        myProto.Repost = function () {
            this.m_isSubmit = false;
            this.CreateAjax();
            this.SendReq();
        }
        CXMLRequest._initialized = true;
    }
    this.CreateAjax();
}

function CXMLGETRequest(tag, client) {
    var me = this;
    var m_tag = tag;
    var m_client = client;
    var m_url = "";
    var m_postData = "";
    var m_isSubmit = false;
    this.SendReq = function () {
        if (!m_isSubmit) {
            try {
                $.getJSON(m_url + "?" + m_postData + "jsoncallback=?", function (xmlStr) {
                    var xml = me.loadXML(xmlStr);
                    m_client.GETRequestHandler(me, xml);
                });
            } catch (e) {
            }
            m_isSubmit = true;
        }
    }
    this.loadXML = function (xmlStr) {
        var xmlDom = null;
        if (window.ActiveXObject) {
            xmlDom = new ActiveXObject("Microsoft.XMLDOM");
            xmlDom.async = false;
            xmlDom.loadXML(xmlStr);
        } else {
            xmlDom = new DOMParser().parseFromString(xmlStr, "text/xml");
        }
        return xmlDom;
    }
    this.SetURL = function (URL) {
        if ("" == m_url) {
            m_url = URL;
        }
    }
    this.AddPostData = function (name, value) {
        m_postData += name + "=" + value + "&";
    }
    this.SetPostData = function (value) {
        m_postData = value;
    }
    this.GetPostData = function (value) {
        return m_postData;
    }
    this.GetTag = function () {
        return m_tag;
    }
};

function CXMLClientKh(srvAddr, cmdAddr, debug) {
    this.m_cmdAddr = "";
    this.m_srvAddr = srvAddr;
    this.m_debug = debug;
    this.m_addNo = 1;
    this.m_gid = 0;
    this.m_vid = 0;
    this.m_tid = 0;
    this.first_tid = 0;
    this.m_link = 0;
    this.m_dwid = 0;
    this.m_kfid = 0;
    this.m_kfName = "";
    this.m_workerid = 0;
    this.m_from = "";
    this.m_kfPage = "";
    this.m_lnkParam = "";
    this.m_tfrom = "";
    this.m_search_engine = "";
    this.m_keyword = "";
    this.m_counter = 0;
    this.m_lastGetTime = 0;
    this.m_lastGetTag = 0;
    this.m_khnumber = 1;
    this.m_shutdown = false;
    var undefined, get_timestamp = "", get_timestamp_old = "";
    if (undefined == cmdAddr) {
        this.m_cmdAddr = "/sendmsg.jsp";
    } else {
        this.m_cmdAddr = cmdAddr;
    }
    if (typeof CXMLClientKh._initialized == 'undefined') {
        var myProto = CXMLClientKh.prototype;
        myProto.GetGid = function () {
            return this.m_gid;
        }
        myProto.GetTid = function () {
            return this.m_tid;
        }
        myProto.GetFirstTid = function () {
            if (this.first_tid == '') {
                return this.m_tid;
            }
            return this.first_tid;
        }
        myProto.GetVid = function () {
            return this.m_vid;
        }
        myProto.GetKfid = function () {
            return this.m_kfid;
        }
        myProto.GetKfname = function () {
            return this.m_kfName;
        }
        myProto.GetWorkerid = function () {
            return this.m_workerid;
        }
        myProto.GetKhnumber = function () {
            return this.m_khnumber;
        }
        myProto.ShutDown = function (isDown) {
            this.m_shutdown = isDown;
            if (isDown) {
                this.m_lastGetTime = 0;
                m_lastSessionTime = 0;
                window.clearInterval(this.timerID);
            } else {
                this.m_lastGetTime = new Date().getTime();
                m_lastSessionTime = new Date().getTime();
            }
        }
        myProto.Timeout = function () {
            if (this.m_lastGetTime > 0 && (new Date().getTime() - this.m_lastGetTime) > 20000) {
                this.GetCmd(true);
            }
        }
        myProto.SetKhInfo = function (gid, frompage, talkpage, talktitle, lnkparam, tfrom, search_engine, keyword) {
            this.m_gid = gid;
            this.m_from = frompage;
            m_talkPage = talkpage;
            m_talktitle = talktitle;
            this.m_lnkParam = lnkparam;
            this.m_tfrom = tfrom;
            this.m_search_engine = search_engine;
            this.m_keyword = keyword;
            this.land_page = arguments[8] ? arguments[8] : '';
        }
        myProto.CreateRequest = function () {
            if (this.m_shutdown) {
                return null;
            } else {
                var req = new CXMLRequest(++this.m_counter, this);
                return req;
            }
        }
        myProto.RequestHandler = function (request) {
            var ajax = request.GetXmlHttp();
            if (ajax.status == 200) {
                if (this.m_debug) {
                    this.OnDebug(ajax.responseText);
                }
                var rspList = XMLGetNodes(ajax.responseXML, 'Response'), rspLength = XMLGetNodesLength(rspList);
                if (rspLength > 0) {
                    var rspListNodes = [];
                    for (var i = 0; i < rspLength; i++) {
                        rspListNodes[i] = XMLGetNode(rspList, i);
                        if (XMLGetNamedAttr(rspListNodes[i], "cmd") == "GET") {
                            get_timestamp = XMLGetNamedAttr(rspListNodes[i], "timestamp");
                            if (get_timestamp != "" && get_timestamp_old == get_timestamp) {
                                this.GetCmd();
                                rspListNodes = null;
                                return;
                            }
                        }
                    }
                    for (var i = 0; i < rspLength; i++) {
                        try {
                            this.RspProc(request.GetTag(), rspListNodes[i]);
                        } catch (e) {
                            this.OnErr(e.name, e.message);
                        }
                    }
                } else {
                    this.m_addNo++;
                    this.OnErr(0, "Parse rsp error!");
                }
            } else {
                var postData = request.GetPostData(), cmd = GetPostDataValue(postData, 1);
                switch (cmd) {
                    case"LNK":
                        this.OnLnkFail();
                        break;
                    case"QST":
                        var msg = GetPostDataValue(postData, 6);
                        this.OnQstFail(msg);
                        break;
                    case"FIL":
                        this.OnFilFail();
                        break;
                    default:
                        break;
                }
            }
        }
        myProto.RspProc = function (tag, rsp) {
            var cmd, errCode = 0, node, nodeList, data, msg, me = this;
            if (null == rsp) {
                return;
            }
            try {
                cmd = XMLGetNamedAttr(rsp, "cmd");
                switch (cmd) {
                    case"LNK": {
                        errCode = XMLGetNamedAttr(rsp, "ecode");
                        this.m_kfid = XMLGetNamedAttr(rsp, "kfid");
                        this.m_kfName = XMLGetNamedAttr(rsp, "kfname");
                        this.m_tid = XMLGetNamedAttr(rsp, "khtmpid");
                        this.first_tid = XMLGetNamedAttr(rsp, "firstkhtempid");
                        this.m_gid = XMLGetNamedAttr(rsp, "khid");
                        this.m_workerid = XMLGetNamedAttr(rsp, "workerid");
                        this.m_khnumber = XMLGetNamedAttr(rsp, "khnumber");
                        var robotid = XMLGetNamedAttr(rsp, "robotid");
                        origin_time = XMLGetNamedAttr(rsp, "time") ? XMLGetNamedAttr(rsp, "time") : 0;
                        if (0 == errCode || 6 == errCode) {
                            var exp = new Date();
                            exp.setTime(exp.getTime() + 60 * 24 * 60 * 60 * 1000);
                            document.cookie = 'lastKfid6d_' + company_id + "=" + escape(this.m_kfid) + ";expires=" + exp.toGMTString();
                            try {
                                window.clearInterval(this.timerID);
                            } catch (e) {
                            }
                            this.timerID = window.setInterval(function () {
                                me.Timeout();
                            }, 2000);
                        } else if ((3 != errCode) && (2 != errCode)) {
                            this.ShutDown(true);
                        }
                        this.OnLinkOpen(errCode, XMLGetNamedAttr(rsp, "emsg"), robotid);
                        break;
                    }
                    case"ADDN":
                        this.m_addNo++;
                        break;
                    case"GET":
                        var isLost = XMLGetNamedAttr(rsp, 'lost');
                        code_key = XMLGetNamedAttr(rsp, 'code_key');
                        if ('true' === isLost) {
                            this.getLostMsg();
                        }
                        if (tag == this.m_lastGetTag) {
                            this.GetCmd();
                        }
                        break;
                    case"ULN":
                        this.OnLinkClose(XMLGetNamedAttr(rsp, "robid"), XMLGetNamedAttr(rsp, "arg"), XMLGetNamedAttr(rsp, "style"), XMLGetNamedAttr(rsp, "workerid"), XMLGetNamedAttr(rsp, "islink"), XMLGetNamedAttr(rsp, "iscswh"), XMLGetNamedAttr(rsp, "islink_companyId"), XMLGetNamedAttr(rsp, "sid"), XMLGetNamedAttr(rsp, "companyId"), XMLGetNamedAttr(rsp, "arg_code"), XMLGetNamedAttr(rsp, "kf_sign"));
                        break;
                    case"FLN":
                        this.OnTimeOverClose(XMLGetNamedAttr(rsp, "link"));
                        break;
                    case"QST":
                        var msgid = XMLGetNamedAttr(rsp, "msgid");
                        var msg_type = XMLGetNamedAttr(rsp, "new_type");
                        if (typeof max_msgid == "undefined" || max_msgid < msgid) max_msgid = msgid;
                        this.OnRecvTalkMsg(XMLGetNamedAttr(rsp, "msg"), XMLGetNamedAttr(rsp, "font"), XMLGetNamedAttr(rsp, "size"), XMLGetNamedAttr(rsp, "color"), XMLGetNamedAttr(rsp, "from"), XMLGetNamedAttr(rsp, "jid6d"), XMLGetNamedAttr(rsp, "sid"), msgid, msg_type);
                        break;
                    case"CINFO":
                        this.OnRecvCinfoMsg(XMLGetNamedAttr(rsp, "logo"), XMLGetNamedAttr(rsp, "title"), XMLGetNamedAttr(rsp, "content"), XMLGetNamedAttr(rsp, "curl"), XMLGetNamedAttr(rsp, "msgType"));
                        break;
                    case"GHQST":
                    case"RLQST":
                        nodeList = XMLGetNodes(rsp, "Data");
                        var node = XMLGetNode(nodeList, 0), rowList = XMLGetNodes(node, "row");
                        this.OnRecvReceiveMsg(rowList);
                        if (typeof rowList.length != "undefined" && rowList.length > 0) {
                            var last_list = rowList[rowList.length - 1];
                            if (typeof last_list.msgid != "undefined") {
                                if (typeof max_msgid == "undefined" || max_msgid < last_list.msgid) max_msgid = last_list.msgid;
                            }
                        }
                        break;
                    case"ANSWER":
                        this.OnRecvQst(XMLGetNamedAttr(rsp, "fk_msgid"));
                        break;
                    case"TYP":
                        msg = XMLGetNamedAttr(rsp, "msg");
                        if ("" == msg) {
                            this.OnTyping();
                        } else {
                            this.OnSetupTyping(msg);
                        }
                        break;
                    case"FIL":
                        this.OnRecvFile(XMLGetNamedAttr(rsp, "filename"), XMLGetNamedAttr(rsp, "sid"), XMLGetNamedAttr(rsp, "jid6d"), XMLGetNamedAttr(rsp, "type"), XMLGetNamedAttr(rsp, "file_cancel_id"), XMLGetNamedAttr(rsp, "size"));
                        break;
                    case"REQST":
                        this.OnRecvReqst(XMLGetNamedAttr(rsp, "file_cancel_id"), XMLGetNamedAttr(rsp, "msg"));
                        break;
                    case"REMSG":
                        this.OnRecvRemsg(XMLGetNamedAttr(rsp, "msgid"));
                        break;
                    case"WAT":
                        this.m_tid = XMLGetNamedAttr(rsp, "khtmpid");
                        this.OnWaitCount(XMLGetNamedAttr(rsp, "count"));
                        if (this.m_gid == undefined || this.m_gid == 0) {
                            this.m_gid = this.m_tid;
                            try {
                                if (this.m_gid > 0) {
                                    var today = new Date();
                                    var expires = new Date();
                                    expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 365 * 30);
                                    document.cookie = "guest_id=" + escape(this.m_gid) + "; expires=" + expires.toGMTString() + ";domain=" + base_host;
                                }
                            } catch (e) {
                            }
                        }
                        break;
                    case"RLK":
                        this.OnRecvRlk();
                        break;
                    case"VOT":
                        this.OnRecvVote(XMLGetNamedAttr(rsp, "sid"), XMLGetNamedAttr(rsp, "state"));
                        break;
                    case"OK":
                        break;
                    case"XLNK":
                        var x_kfid = XMLGetNamedAttr(rsp, "kfid");
                        var x_gid = XMLGetNamedAttr(rsp, "khid");
                        var x_companyid = XMLGetNamedAttr(rsp, "companyid");
                        this.OnRecvXLNK(x_kfid, x_gid, x_companyid);
                        break;
                    case"GRL":
                        this.sendGrl();
                        break;
                    case"GUESTMENU":
                        this.OnRecvGuestmenu(XMLGetNamedAttr(rsp, "title"), XMLGetNamedAttr(rsp, "ids"), XMLGetNamedAttr(rsp, "msgid"));
                        break;
                    default:
                        this.OnErr(0, "unknown rsp:" + cmd);
                }
            } catch (e) {
                this.OnErr(e.name, e.message);
                return;
            }
        }
        myProto.OnLogin = function (errCode) {
        }
        myProto.OnLinkOpen = function (errCode, errMsg) {
        }
        myProto.OnLinkClose = function (robid, arg, style, workerid) {
        }
        myProto.OnTimeOverClose = function (link) {
        }
        myProto.OnRecvTalkMsg = function (msg, font, size, color, from, jid6d, sid) {
        }
        myProto.OnRecvCinfoMsg = function (logo, title, content, curl, msgType) {
        }
        myProto.OnRecvReceiveMsg = function (rowList) {
        }
        myProto.OnTyping = function () {
        }
        myProto.OnSetupTyping = function (mode) {
        }
        myProto.OnRecvFile = function (fileName, sid, jid6d, type) {
        }
        myProto.OnErr = function (errCode, message) {
        }
        myProto.OnDebug = function (dbgInfo) {
        }
        myProto.OnWaitCount = function (cnt) {
        }
        myProto.OnRecvRlk = function () {
        }
        myProto.OnLnkFail = function () {
        }
        myProto.OnQstFail = function (msg) {
        }
        myProto.OnFilFail = function () {
        }
        myProto.OnRecvVote = function (id6d, state) {
        }
        myProto.OnRecvQst = function (fk_msgid) {
        }
        myProto.OnRecvGuestmenu = function (title, ids, formid) {
        }
        myProto.OpenLink = function (dwid, kfList, type, autotips, khname, dwname, khinfo, khcontact, question) {
            this.ShutDown(false);
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            this.m_lastGetTime = new Date().getTime();
            var last_id6d = this.getCookie('lastKfid6d_' + company_id);
            if (last_id6d == undefined) last_id6d = 0;
            var islink = 0;
            var iscswh = 0;
            try {
                var url = location.search;
                var params_arr = url.split('&');
                for (var i = 0; i < params_arr.length; i++) {
                    if (params_arr[i].indexOf('switch_workerid') != -1) {
                        var workerid_str = params_arr[i].split('=');
                        kfList = workerid_str[1];
                    }
                    if (params_arr[i].indexOf('islink_companyId') != -1) {
                        var islink_companyId = params_arr[i].split('=');
                        islink_companyId = islink_companyId[1];
                    }
                    if (params_arr[i].indexOf('iscswh_id6d') != -1) {
                        var iscswh_id6d = params_arr[i].split('=');
                        iscswh_id6d = iscswh_id6d[1];
                    }
                    if (params_arr[i].indexOf('iscswh_companyId') != -1) {
                        var iscswh_companyId = params_arr[i].split('=');
                        iscswh_companyId = iscswh_companyId[1];
                    }
                }
                if (url.indexOf('islink=1') != -1) {
                    islink = 1;
                }
                if (url.indexOf('iscswh=1') != -1) {
                    iscswh = 1;
                }
            } catch (e) {
            }
            var isold = 0;
            if (isoldkf == 1 || this.getCookie("isoldkf_" + company_id + "_" + myid) == 1) isold = 1;
            req.AddPostData("cmd", "LNK");
            req.AddPostData("sid", "");
            req.AddPostData("lastKfid6d", last_id6d);
            req.AddPostData("did", "11");
            req.AddPostData("khid", this.m_gid);
            req.AddPostData("dwid", dwid);
            req.AddPostData("type", type);
            req.AddPostData("kf_list", kfList);
            req.AddPostData("from", this.m_from);
            req.AddPostData("talkpage", m_talkPage);
            req.AddPostData("talktitle", m_talktitle);
            req.AddPostData("lnkparam", this.m_lnkParam);
            req.AddPostData("lnkfire", lnk_fire);
            req.AddPostData("tfrom", this.m_tfrom);
            req.AddPostData("style", style);
            req.AddPostData("ucust_id", encodeURIComponent(ucust_id));
            req.AddPostData("u_stat_id", u_stat_id);
            req.AddPostData("stat_id", uid);
            req.AddPostData("firewall", firewall_uuid);
            req.AddPostData("style_id", style_id);
            req.AddPostData("search_engine", encodeURIComponent(this.m_search_engine));
            req.AddPostData("keyword", this.m_keyword);
            req.AddPostData("land_page", this.land_page);
            req.AddPostData("open_time", open_time);
            req.AddPostData("islink", islink);
            req.AddPostData("iscswh", iscswh);
            if (is_group != undefined) {
                req.AddPostData("is_group", is_group);
            }
            if (autotips != undefined) {
                req.AddPostData("autotips", autotips);
            }
            if (khname != undefined) {
                req.AddPostData("khname", khname);
            }
            if (dwname != undefined) {
                req.AddPostData("dwname", dwname);
            }
            if (khinfo != undefined) {
                req.AddPostData("khinfo", khinfo);
            }
            if (khcontact != undefined) {
                req.AddPostData("khcontact", khcontact);
            }
            if (question != undefined) {
                req.AddPostData("question", question);
            }
            if (channel !== '') {
                req.AddPostData("channel", encodeURIComponent(channel));
            }
            if (code_key !== '') {
                req.AddPostData("code_key", code_key);
            }
            if (verify_key !== '') {
                req.AddPostData("verify_key", verify_key);
            }
            if (lnk_overflow !== '') {
                req.AddPostData("lnk_overflow", lnk_overflow);
            }
            if (islink_companyId != undefined) {
                req.AddPostData("islink_companyId", islink_companyId);
            }
            if (iscswh_id6d != undefined) {
                req.AddPostData("iscswh_id6d", iscswh_id6d);
            }
            if (iscswh_companyId != undefined) {
                req.AddPostData("iscswh_companyId", iscswh_companyId);
            }
            if (is_sceneToTalk) {
                req.AddPostData("isscene", 1);
            }
            req.AddPostData("time", this.m_lastGetTime);
            req.SendReq();
            this.m_lastGetTag = req.GetTag();
            this.m_dwid = dwid;
            return req.GetTag();
        }
        myProto.GetCmd = function (reconnect) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            if (reconnect) {
                this.m_addNo++;
                req.AddPostData("did", "11");
                this.OnDebug("Reconnect");
            } else {
                req.AddPostData("did", "0");
            }
            this.m_lastGetTime = new Date().getTime();
            req.AddPostData("first_khtempid", this.first_tid);
            req.AddPostData("gid", this.m_gid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("cmd", "GET");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("msg", this.m_addNo);
            req.AddPostData("time", this.m_lastGetTime);
            if (get_timestamp != "") {
                get_timestamp_old = get_timestamp;
                req.AddPostData("timestamp", get_timestamp);
            }
            if (code_key !== '') {
                req.AddPostData("code_key", code_key);
            }
            if (verify_key !== '') {
                req.AddPostData("verify_key", verify_key);
            }
            req.AddPostData("style_id", style_id);
            req.AddPostData("version", commond_version);
            req.SendReq();
            this.m_lastGetTag = req.GetTag();
            return req.GetTag();
        }
        myProto.TerminateLink = function () {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "ULN");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            this.OnLinkClose("", "", "");
            return req.GetTag();
        }
        myProto.QuitWait = function () {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "WAT");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", 11);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.RegSuccess = function (gid) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "REG");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("khid", gid);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendTalkMsg = function (msg, code, fk_msgid, msg_type, msgid) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "QST");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("first_khtempid", this.first_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("msg", msg);
            req.AddPostData("gid", this.m_gid);
            req.AddPostData("stat_id", uid);
            req.AddPostData("time", new Date().getTime() + 1);
            if (code_key !== '') {
                req.AddPostData("code_key", code_key);
            }
            if (verify_key !== '') {
                req.AddPostData("verify_key", verify_key);
            }
            req.AddPostData("style_id", style_id);
            req.AddPostData("code", code);
            if (fk_msgid != undefined) {
                req.AddPostData("fk_msgid", fk_msgid);
            }
            if (msg_type != undefined && msg_type != '') {
                req.AddPostData("msg_type", msg_type);
            }
            if (msgid != undefined && msgid != '') {
                req.AddPostData("msgid", msgid);
            }
            if (typeof max_msgid != "undefined") {
                req.AddPostData("max_msgid", max_msgid);
            } else {
                req.AddPostData("max_msgid", 0);
            }
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendCinfoMsg = function (logo, title, content, curl) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "CINFO");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("first_khtempid", this.first_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("logo", logo);
            req.AddPostData("title", title);
            req.AddPostData("content", content);
            req.AddPostData("curl", curl);
            req.AddPostData("gid", this.m_gid);
            req.AddPostData("time", new Date().getTime() + 1);
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendConnPrompt = function (msg) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "HINT");
            req.AddPostData("did", this.m_tid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("msg", msg);
            req.AddPostData("guest_id", this.m_gid);
            req.AddPostData("id6d", this.m_kfid);
            req.AddPostData("sid", this.first_tid);
            req.AddPostData("time", new Date().getTime() + 1);
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendCallBackPhone = function (code, phone, call_id) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "CBP");
            req.AddPostData("code", code);
            req.AddPostData("phone", phone);
            req.AddPostData("call_id", call_id);
            req.AddPostData("sid", this.first_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("time", new Date().getTime() + 1);
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendReceiveMsg = function () {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "GHQST");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("time", new Date().getTime());
            req.AddPostData("first_khtempid", this.first_tid);
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendAttachMsg = function (msg) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "TIP");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("msg", msg);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendTyping = function (msg) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "TYP");
            req.AddPostData("first_khtempid", this.first_tid);
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("msg", msg);
            req.AddPostData("khid", this.m_gid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendFile = function (fileURL, type, size) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "FIL");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("msg", fileURL);
            req.AddPostData("type", type);
            req.AddPostData("size", size);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendVote = function (state) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "VOT");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("gid", this.m_gid);
            req.AddPostData("state", state);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.getCookie = function (objName) {
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                if (temp[0] == objName) return unescape(temp[1]);
            }
        }
        myProto.sendGrl = function () {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData('cmd', 'GRL');
            req.AddPostData('first_khtempid', this.first_tid);
            req.AddPostData('gid', this.m_gid);
            req.AddPostData("sid", this.m_tid);
            req.AddPostData('dwid', this.m_dwid);
            req.AddPostData('did', this.m_kfid);
            req.AddPostData("stat_id", uid);
            req.AddPostData('time', new Date().getTime());
            if (code_key !== '') {
                req.AddPostData("code_key", code_key);
            }
            if (verify_key !== '') {
                req.AddPostData("verify_key", verify_key);
            }
            if (typeof max_msgid != "undefined") {
                req.AddPostData("max_msgid", max_msgid);
            } else {
                req.AddPostData("max_msgid", 0);
            }
            req.AddPostData("style_id", style_id);
            req.SendReq();
            this.m_lastGetTag = req.GetTag();
            return req.GetTag();
        }
        myProto.getLostMsg = function () {
            var req = this.CreateRequest();
            if (null === req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData('cmd', 'OQST');
            req.AddPostData('sid', this.m_tid);
            req.AddPostData('time', new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        myProto.SendGstm = function (msg) {
            var req = this.CreateRequest();
            if (null == req) {
                return;
            }
            req.SetURL(this.m_srvAddr + this.m_cmdAddr);
            req.AddPostData("cmd", "GSTM");
            req.AddPostData("sid", this.m_tid);
            req.AddPostData("did", this.m_kfid);
            req.AddPostData("msg", msg);
            req.AddPostData("guest_id", this.m_gid);
            req.AddPostData("dwid", this.m_dwid);
            req.AddPostData("time", new Date().getTime());
            req.SendReq();
            return req.GetTag();
        }
        CXMLClientKh._initialized = true;
    }
};

function waitClinet() {
    var _this = this;
    var waitPro = waitClinet.prototype;
    _this.company_id = company_id;
    _this.myid = guest_id;
    _this.style = style;
    _this.beatId = 0;
    _this.beatTime = 20000;
    _this.sendQueue = [];
    _this.overId = 0;
    _this.overTime = 20000;
    _this.http_pro = "";
    _this.wait_host = "";
    _this.talkpage = "";
    _this.frompage = "";
    _this.search_engine = "";
    _this.keyword = "";
    _this.land_page = "";
    _this.tfrom = "";
    _this.is_group = "";
    _this.open_time = "";
    _this.uid = "";
    _this.talk_id = 0;
    _this.callBacks = {
        "GID_CALL": function (data) {
        },
    };
    waitPro.init = function () {
        if (_this.myid > 0) {
            _this.sendBeat();
            _this.beatId = setInterval(_this.sendBeat, _this.beatTime);
        } else {
            _this.sendGid();
        }
        _this.overId = setInterval(function () {
            var now = new Date().getTime();
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (now - _this.sendQueue[i].time > 20000) {
                    var data = _this.sendQueue.shift();
                    _this.faliHandler(data);
                }
            }
        }, _this.overTime);
    }
    waitPro.setParams = function (http_pro, wait_host, talkpage, frompage, search_engine, keyword, land_page, tfrom, is_group, open_time, uid, guest_id) {
        _this.http_pro = http_pro;
        _this.wait_host = wait_host;
        _this.talkpage = talkpage;
        _this.frompage = frompage;
        _this.search_engine = search_engine;
        _this.keyword = keyword;
        _this.land_page = land_page;
        _this.tfrom = tfrom;
        _this.is_group = is_group;
        _this.open_time = open_time;
        _this.uid = uid;
        if (typeof guest_id != "undefined" && guest_id > 0) {
            _this.myid = guest_id;
        }
    }
    waitPro.closeLink = function () {
        if (_this.beatId) clearInterval(_this.beatId);
        if (_this.overId) clearInterval(_this.overId);
    }
    waitPro.send = function (sendData) {
        jQuery.support.cors = true;
        $.ajax({
            type: "POST",
            url: _this.http_pro + _this.wait_host + "/sendwait.jsp?k=" + _this.myid + "&v=" + new Date().getTime(),
            data: sendData,
            timeout: 20000,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            },
            success: function (data) {
                _this.clearData(data);
                _this.sucHandler(data);
            },
            error: function (xhr, status, error) {
                _this.clearData(sendData);
                _this.faliHandler(sendData);
            }
        });
    }
    waitPro.sucHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"GID":
                _this.myid = data.gid;
                _this.callBacks.GID_CALL(data.gid);
                _this.sendBeat();
                _this.beatId = setInterval(_this.sendBeat, _this.beatTime);
                break;
            case"OK":
                if (_this.talk_id == 0 && data.talk_id != undefined) {
                    _this.talk_id = data.talk_id;
                }
                break;
        }
    }
    waitPro.faliHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"ROA":
                if (data.sendtimes < 5) {
                    data.sendtimes++;
                    _this.sendRoa(data.msg, data.size, data.sendtimes);
                }
                break;
            case"GID":
                _this.sendGid();
                break;
        }
    }
    waitPro.clearData = function (data) {
        if (data.timestamp != "") {
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (data.timestamp = _this.sendQueue[i].time) {
                    _this.sendQueue.splice(i, 1);
                    i--;
                }
            }
        }
    }
    waitPro.sendBeat = function () {
        var sendData = {
            "cmd": "BEAT",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "talk_id": _this.talk_id,
            "time": new Date().getTime()
        }
        _this.send(sendData);
    }
    waitPro.sendGid = function () {
        var sendData = {"cmd": "GID", "company_id": _this.company_id, "time": new Date().getTime()}
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    waitPro.sendRoa = function (msg, size, sendtimes) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        var sendData = {
            "cmd": "ROA",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "talkPage": _this.talkpage,
            "fromPage": _this.frompage,
            "search": _this.search_engine,
            "keyword": _this.keyword,
            "landPage": _this.land_page,
            "style": _this.style,
            "tFrom": _this.tfrom,
            "is_group": _this.is_group,
            "open_time": _this.open_time,
            "stat_id": _this.uid,
            "msg": msg,
            "size": size,
            "sendtimes": sendtimes,
            "talk_id": _this.talk_id,
            "time": new Date().getTime(),
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    waitPro.sendStart = function () {
        var sendData = {
            "cmd": "START",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "time": new Date().getTime(),
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    waitPro.setCallBack = function (callName, callBack) {
        if (typeof _this.callBacks[callName] != "undefined" && typeof callBack == "function") {
            _this.callBacks[callName] = callBack;
        }
    }
}

var wait_client = new waitClinet();
;

function sceneClinet() {
    var _this = this;
    var scenePro = sceneClinet.prototype;
    _this.company_id = company_id;
    _this.myid = guest_id;
    _this.style = style;
    _this.style_id = style_id;
    _this.getTime = 20000;
    _this.getOver = false;
    _this.sendQueue = [];
    _this.roaQueue = [];
    _this.overId = 0;
    _this.overTime = 1000;
    _this.http_pro = "";
    _this.scene_host = "";
    _this.talkpage = "";
    _this.frompage = "";
    _this.search_engine = "";
    _this.keyword = "";
    _this.land_page = "";
    _this.tfrom = "";
    _this.is_group = "";
    _this.open_time = "";
    _this.uid = "";
    _this.u_stat_id = "";
    _this.ucust_id = "";
    _this.lnksuccess = false;
    _this.callBacks = {
        "GID_CALL": function (data) {
        }, "ROA_CALL": function (data) {
        }, "SLNK_CALL": function (data) {
        },
    };
    scenePro.init = function () {
        if (_this.myid > 0) {
            _this.sendLnk();
        } else {
            _this.sendGid();
        }
        _this.overId = setInterval(function () {
            var now = new Date().getTime();
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (now - _this.sendQueue[i].time > 20000) {
                    var data = _this.sendQueue.shift();
                    _this.faliHandler(data);
                }
            }
        }, 1000);
    }
    scenePro.setParams = function (http_pro, scene_host, talkpage, frompage, search_engine, keyword, land_page, tfrom, is_group, open_time, guest_id, uid, ucust_id, u_stat_id) {
        _this.http_pro = http_pro;
        _this.scene_host = scene_host;
        _this.talkpage = talkpage;
        _this.frompage = frompage;
        _this.search_engine = search_engine;
        _this.keyword = keyword;
        _this.land_page = land_page;
        _this.tfrom = tfrom;
        _this.is_group = is_group;
        _this.open_time = open_time;
        _this.uid = uid;
        _this.u_stat_id = u_stat_id;
        _this.ucust_id = ucust_id;
        if (typeof guest_id != "undefined" && guest_id > 0) {
            _this.myid = guest_id;
        }
    }
    scenePro.closeLink = function (send) {
        _this.getOver = true;
        if (_this.overId) clearInterval(_this.overId);
        if (send) _this.sendEnd();
    }
    scenePro.send = function (sendData) {
        jQuery.support.cors = true;
        $.ajax({
            type: "POST",
            url: _this.http_pro + _this.scene_host + "/sendscene.jsp?k=" + _this.myid + "&v=" + new Date().getTime(),
            data: sendData,
            timeout: 20000,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            },
            success: function (data) {
                if (data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        _this.clearData(data[i]);
                        _this.sucHandler(data[i]);
                    }
                } else {
                    _this.clearData(data);
                    _this.sucHandler(data);
                }
            },
            error: function (xhr, status, error) {
                sendData.timestamp = sendData.time;
                _this.clearData(sendData);
                _this.faliHandler(sendData);
            }
        });
    }
    scenePro.sucHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"GID":
                _this.myid = data.gid;
                _this.callBacks.GID_CALL(data.gid);
                _this.sendLnk();
                break;
            case"GET":
                _this.sendGet();
                break;
            case"SLNK":
                _this.temp_id = data.temp_id;
                _this.sucLnk(data.step);
                break;
            case"ROA":
                _this.callBacks.ROA_CALL(data.step, data.point, data.steps);
                break;
            case"END":
                _this.closeLink();
                break;
            case"OK":
                break;
        }
    }
    scenePro.faliHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"SLNK":
                if (data.sendtimes < 3) {
                    data.sendtimes++;
                    _this.sendLnk(data.sendtimes);
                }
                break;
            case"ROA":
                if (data.sendtimes < 5) {
                    data.sendtimes++;
                    _this.sendRoa(data.msg, data.size, data.type, data.point, data.sendtimes);
                }
                break;
            case"GID":
                _this.sendGid();
                break;
            case"GET":
                _this.sendGet();
                break;
        }
    }
    scenePro.sucLnk = function (step) {
        _this.lnksuccess = true;
        _this.sendGet();
        _this.callBacks.SLNK_CALL(step);
        if (_this.roaQueue.length > 0) {
            for (var i = 0; i < _this.roaQueue.length; i++) {
                _this.sendQueue.push(_this.roaQueue[i]);
                _this.roaQueue[i].temp_id = _this.temp_id;
                _this.send(_this.roaQueue[i]);
            }
        }
    }
    scenePro.clearData = function (data) {
        if (data.timestamp != "") {
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (data.timestamp = _this.sendQueue[i].time) {
                    _this.sendQueue.splice(i, 1);
                    i--;
                }
            }
        }
    }
    scenePro.sendGet = function () {
        var sendData = {
            "cmd": "GET",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "time": new Date().getTime()
        }
        if (!_this.getOver) {
            _this.sendQueue.push(sendData);
            _this.send(sendData);
        }
    }
    scenePro.sendEnd = function () {
        var sendData = {
            "cmd": "END",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "time": new Date().getTime()
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    scenePro.sendLnk = function (sendtimes) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        var sendData = {
            "cmd": "SLNK",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "style_id": _this.style_id,
            "frompage": _this.frompage,
            "land_page": _this.land_page,
            "talkpage": _this.talkpage,
            "keyword": _this.keyword,
            "search_engine": _this.search_engine,
            "tfrom": _this.tfrom,
            "is_group": _this.is_group,
            "open_time": _this.open_time,
            "stat_id": _this.uid,
            "ucust_id": _this.ucust_id,
            "u_stat_id": _this.u_stat_id,
            "sendtimes": sendtimes,
            "time": new Date().getTime()
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    scenePro.sendGid = function () {
        var sendData = {"cmd": "GID", "company_id": _this.company_id, "time": new Date().getTime()}
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    scenePro.sendRoa = function (msg, step, type, point, sendtimes, code) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        if (typeof point == "undefined") point = '';
        if (typeof code == "undefined") code = '';
        var sendData = {
            "cmd": "ROA",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "msg": msg,
            "step": step,
            "type": type,
            "point": point,
            "code": code,
            "sendtimes": sendtimes,
            "time": new Date().getTime(),
        }
        if (_this.lnksuccess) {
            _this.sendQueue.push(sendData);
            _this.send(sendData);
        } else {
            _this.roaQueue.push(sendData);
        }
    }
    scenePro.setCallBack = function (callName, callBack) {
        if (typeof _this.callBacks[callName] != "undefined" && typeof callBack == "function") {
            _this.callBacks[callName] = callBack;
        }
    }
}

var scene_client = new sceneClinet();
;

function robotClinet() {
    var _this = this;
    var robotPro = robotClinet.prototype;
    _this.company_id = company_id;
    _this.myid = guest_id;
    _this.style = style;
    _this.style_id = style_id;
    _this.getTime = 20000;
    _this.getOver = false;
    _this.sendQueue = [];
    _this.roaQueue = [];
    _this.overId = 0;
    _this.overTime = 1000;
    _this.http_pro = "";
    _this.robot_host = "";
    _this.talkpage = "";
    _this.frompage = "";
    _this.search_engine = "";
    _this.keyword = "";
    _this.land_page = "";
    _this.tfrom = "";
    _this.is_group = "";
    _this.open_time = "";
    _this.uid = "";
    _this.u_stat_id = "";
    _this.ucust_id = "";
    _this.channel = "";
    _this.robot_id = "";
    _this.robot_name = "";
    _this.lnksuccess = false;
    _this.robot_talk_list = [];
    _this.first_tempid = 0;
    _this.temp_id = 0;
    _this.beatTimer = 0;
    _this.sendBeatTimer = 0;
    _this.getBeatTimer = 0;
    _this.callBacks = {
        "GID_CALL": function (data) {
        }, "ROA_CALL": function (data) {
        }, "RLNK_CALL": function () {
        }, "RQST_CALL": function (list) {
        }, "ULN_CALL": function () {
        }, "ZRG_CALL": function (data) {
        }, "RECEPTION_CALL": function (data) {
        }
    };
    robotPro.init = function () {
        if (_this.myid > 0) {
            _this.sendLnk();
        } else {
            _this.sendGid();
        }
        _this.overId = setInterval(function () {
            var now = new Date().getTime();
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (now - _this.sendQueue[i].time > 20000) {
                    var data = _this.sendQueue.shift();
                    _this.faliHandler(data);
                }
            }
        }, 1000);
    }
    robotPro.setParams = function (http_pro, robot_host, talkpage, frompage, search_engine, keyword, land_page, tfrom, is_group, open_time, guest_id, uid, ucust_id, u_stat_id, channel, robot_id, robot_name) {
        _this.http_pro = http_pro;
        _this.robot_host = robot_host;
        _this.talkpage = talkpage;
        _this.frompage = frompage;
        _this.search_engine = search_engine;
        _this.keyword = keyword;
        _this.land_page = land_page;
        _this.tfrom = tfrom;
        _this.is_group = is_group;
        _this.open_time = open_time;
        _this.uid = uid;
        _this.u_stat_id = u_stat_id;
        _this.ucust_id = ucust_id;
        _this.channel = channel;
        _this.robot_id = robot_id;
        _this.robot_name = robot_name;
        if (typeof guest_id != "undefined" && guest_id > 0) {
            _this.myid = guest_id;
        }
    }
    robotPro.closeLink = function (send) {
        _this.getOver = true;
        if (_this.overId) clearInterval(_this.overId);
        if (_this.beatTimer) clearInterval(_this.beatTimer);
    }
    robotPro.send = function (sendData) {
        jQuery.support.cors = true;
        $.ajax({
            type: "POST",
            url: _this.http_pro + _this.robot_host + "/sendrobot.jsp?k=" + _this.myid + "&v=" + new Date().getTime(),
            data: sendData,
            timeout: 20000,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            },
            success: function (data) {
                if (data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        _this.clearData(data[i]);
                        _this.sucHandler(data[i]);
                    }
                } else {
                    _this.clearData(data);
                    _this.sucHandler(data);
                }
            },
            error: function (xhr, status, error) {
                sendData.timestamp = sendData.time;
                _this.clearData(sendData);
                setTimeout(function () {
                    _this.faliHandler(sendData);
                }, 2000);
            }
        });
    }
    robotPro.sendBeat = function (sendData) {
        jQuery.support.cors = true;
        $.ajax({
            type: "POST",
            url: _this.http_pro + _this.robot_host + "/sendrobot.jsp?k=" + _this.myid + "&v=" + new Date().getTime(),
            data: sendData,
            timeout: 20000,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            },
            success: function (data) {
                _this.getBeatTimer = new Date().getTime();
                if (data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        _this.sucHandler(data[i]);
                    }
                } else {
                    _this.sucHandler(data);
                }
            },
            error: function (xhr, status, error) {
            }
        });
    }
    robotPro.sucHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"GID":
                _this.myid = data.gid;
                _this.callBacks.GID_CALL(data.gid);
                _this.sendLnk();
                break;
            case"GET":
                _this.sendGet();
                break;
            case"RLNK":
                _this.temp_id = data.temp_id;
                _this.first_tempid = data.first_tempid;
                _this.sucLnk();
                break;
            case"ROA":
                _this.robot_talk_list.push(data);
                if (window.sessionStrage) {
                    window.sessionStrage[_this.company_id + "_" + _this.myid + "_" + _this.style + "_" + _this.first_tempid] = JSON.stringify(_this.robot_talk_list);
                }
                break;
            case"RQST":
                _this.callBacks.RQST_CALL(data.datas);
                break;
            case"END":
                _this.closeLink();
                break;
            case"ULN":
                _this.closeLink();
                _this.callBacks.ULN_CALL();
                break;
            case"ZRG":
                _this.closeLink();
                _this.callBacks.ZRG_CALL(data.workerid);
                break;
            case"RECEPTION":
                _this.callBacks.RECEPTION_CALL(data.workerid);
                break;
            case"OK":
                break;
        }
    }
    robotPro.faliHandler = function (data) {
        var cmd = data.cmd;
        switch (cmd) {
            case"RLNK":
                if (data.sendtimes < 3) {
                    data.sendtimes++;
                    _this.sendLnk(data.sendtimes);
                }
                break;
            case"ROA":
                if (data.sendtimes < 5) {
                    data.sendtimes++;
                    _this.sendRoa(data.msg, data.type, data.code, data.task_zsk_id, data.index, data.index_times, data.guide_size, data.sendtimes);
                }
                break;
            case"RQST":
                if (data.sendtimes < 3) {
                    data.sendtimes++;
                    _this.sendRqst(data.sendtimes);
                }
                break;
            case"GID":
                _this.sendGid();
                break;
            case"GET":
                break;
        }
    }
    robotPro.sucLnk = function () {
        _this.lnksuccess = true;
        _this.openGetBeat();
        _this.sendGet();
        _this.callBacks.RLNK_CALL();
        if (_this.roaQueue.length > 0) {
            for (var i = 0; i < _this.roaQueue.length; i++) {
                _this.sendQueue.push(_this.roaQueue[i]);
                _this.roaQueue[i].temp_id = _this.temp_id;
                _this.send(_this.roaQueue[i]);
            }
        }
    }
    robotPro.openGetBeat = function () {
        _this.sendBeatTimer = _this.getBeatTimer = new Date().getTime();
        _this.beatTimer = setInterval(function () {
            var now = new Date().getTime();
            if (now - _this.sendBeatTimer > 20000) {
                _this.sendGet();
            }
        }, 1000);
    }
    robotPro.clearData = function (data) {
        if (data.timestamp != "") {
            for (var i = 0; i < _this.sendQueue.length; i++) {
                if (data.timestamp = _this.sendQueue[i].time) {
                    _this.sendQueue.splice(i, 1);
                    i--;
                }
            }
        }
    }
    robotPro.sendGet = function () {
        var sendData = {
            "cmd": "GET",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "time": new Date().getTime()
        }
        if (!_this.getOver) {
            _this.sendBeatTimer = new Date().getTime();
            _this.sendBeat(sendData);
        }
    }
    robotPro.sendEnd = function () {
        var sendData = {
            "cmd": "END",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "time": new Date().getTime()
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    robotPro.sendLnk = function (sendtimes) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        var sendData = {
            "cmd": "RLNK",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "style_id": _this.style_id,
            "frompage": _this.frompage,
            "land_page": _this.land_page,
            "talkpage": _this.talkpage,
            "keyword": _this.keyword,
            "search_engine": _this.search_engine,
            "tfrom": _this.tfrom,
            "is_group": _this.is_group,
            "open_time": _this.open_time,
            "stat_id": _this.uid,
            "ucust_id": _this.ucust_id,
            "u_stat_id": _this.u_stat_id,
            "channel": _this.channel,
            "sendtimes": sendtimes,
            "robot_id": _this.robot_id,
            "robot_name": _this.robot_name,
            "time": new Date().getTime()
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    robotPro.sendGid = function () {
        var sendData = {"cmd": "GID", "company_id": _this.company_id, "time": new Date().getTime()}
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    robotPro.sendRoa = function (msg, type, code, task_zsk_id, index, index_times, guide_size, sendtimes) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        var sendData = {
            "cmd": "ROA",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "msg": msg,
            "type": type,
            "stat_id": _this.uid,
            "sendtimes": sendtimes,
            "code": code,
            "robot_id": _this.robot_id,
            "robot_name": _this.robot_name,
            "time": new Date().getTime(),
        }
        if (typeof task_zsk_id != "undefined" && typeof index != "undefined" && typeof index_times != "undefined" && typeof guide_size != "undefined") {
            sendData["task_zsk_id"] = task_zsk_id;
            sendData["index"] = index;
            sendData["index_times"] = index_times;
            sendData["guide_size"] = guide_size;
        }
        if (_this.lnksuccess && !_this.getOver) {
            _this.sendQueue.push(sendData);
            _this.send(sendData);
        } else {
            _this.roaQueue.push(sendData);
        }
    }
    robotPro.sendRqst = function (sendtimes) {
        if (typeof sendtimes == "undefined") sendtimes = 0;
        var sendData = {
            "cmd": "RQST",
            "company_id": _this.company_id,
            "guest_id": _this.myid,
            "style": _this.style,
            "temp_id": _this.temp_id,
            "sendtimes": sendtimes,
            "time": new Date().getTime(),
        }
        _this.sendQueue.push(sendData);
        _this.send(sendData);
    }
    robotPro.setCallBack = function (callName, callBack) {
        if (typeof _this.callBacks[callName] != "undefined" && typeof callBack == "function") {
            _this.callBacks[callName] = callBack;
        }
    }
}

var robot_client = new robotClinet();
;

function taskRobot() {
    var _this = this;
    var taskProto = taskRobot.prototype;
    var task_robot = {};
    _this.company_id = 0;
    _this.robot_url = "client/client_robot_task.php";
    _this.is_create = true;
    _this.is_use = false;
    _this.task_un_answer = [];
    _this.first_task_list = [];
    _this.now_task_list = {};
    _this.now_task = {};
    _this.intype = "question";
    _this.answer_show_index = 0;
    _this.index_times = 0;
    _this.m_prompt_guide_list = [];
    _this.prompt_guide_size = -1;
    _this.prompt_guide_timer = 0;
    _this.landpage = "";
    _this.keyword = "";
    _this.last_msg = "";
    _this.task_type = "match_first";
    _this.task_type_list = ["match_first", "keyword_first"];
    _this.in_show_answer = false;
    _this.prepare_msg_list = [];
    _this.no_talk_timer = 0;
    _this.is_continue_task = 0;
    _this.inConnPrompt = false;
    _this.showMsgProcessTimer = 0;
    taskProto.init = function (company_id, task_robot_data, is_use, talk_robot_info, alias, m_prompt_guide_list, landpage, keyword, task_type) {
        _this.company_id = company_id;
        _this.task_robot = task_robot_data;
        _this.is_use = is_use == "" ? 0 : parseInt(is_use);
        _this.m_prompt_guide_list = m_prompt_guide_list;
        _this.landpage = landpage;
        _this.keyword = keyword;
        if (typeof task_type != "undefined" && _this.task_type_list.indexOf(task_type) !== -1) {
            _this.task_type = task_type;
        }
        if (!_this.is_use) return;
        var guide_content = _this.task_robot.guide_content;
        if (_this.task_robot.task_id == 0) _this.is_create = false;
        if (typeof guide_content[0] != "undefined") {
            _this.first_task_list = guide_content[0];
        }
        _this.task_un_answer = _this.task_robot.tclose_promet;
        if (typeof talk_robot_info.khnumber != "undefined" && typeof talk_robot_info.task_zsk_id != "undefined" && typeof guide_content[talk_robot_info.task_zsk_id] != undefined) {
            if (typeof guide_content[talk_robot_info.task_zsk_id] != "undefined") {
                _this.now_task_list = guide_content[talk_robot_info.task_zsk_id];
            } else {
                _this.now_task_list = _this.first_task_list;
            }
            _this.answer_show_index = talk_robot_info.index;
            _this.index_times = talk_robot_info.index_times;
            _this.now_task = talk_robot_info.now_task;
            _this.prompt_guide_size = talk_robot_info.guide_size;
            _this.is_continue_task = 1;
            if (talk_robot_info.task_zsk_id == -1) {
                _this.showTConnPrompt(_this.task_robot.tconn_promet);
            }
        } else {
            if (is_use) {
                _this.showTConnPrompt(_this.task_robot.tconn_promet);
            }
            _this.now_task_list = _this.first_task_list;
        }
        if (typeof alias != "undefined" && alias != "") _this.robot_url = alias + "/" + _this.robot_url;
    }
    taskProto.taskContinue = function () {
        if (_this.is_continue_task == 0) return;
        _this.is_continue_task = 1;
        if (_this.answer_show_index > 0) {
            _this.isMatchHandle(_this.now_task);
        } else {
            if (_this.now_task.answer[_this.now_task.answer.length - 1].type == "ask_option") {
                _this.showOption(_this.now_task.answer[_this.now_task.answer.length - 1].option);
            }
        }
    }
    taskProto.setNetList = function () {
        _this.answer_show_index = 0;
        _this.index_times = 0;
        var use_id = _this.now_task.link_id == 0 ? _this.now_task.id : _this.now_task.link_id;
        if (typeof guide_content[use_id] != "undefined") {
            _this.now_task_list = guide_content[use_id];
        } else {
            _this.now_task_list = _this.first_task_list;
        }
    }
    taskProto.checkUse = function () {
        return _this.is_use;
    }
    taskProto.showTConnPrompt = function (tconn_promet) {
        if (tconn_promet.type == "message") {
            var conn_promet = tconn_promet.content;
            for (var i = 0; i < conn_promet.length; i++) {
                _this.kfShow(conn_promet[i], _this.now_task, _this.answer_show_index, _this.index_times, _this.prompt_guide_size);
            }
        } else if (tconn_promet.type == "guide") {
            _this.showGuide();
        } else if (tconn_promet.type == "messages") {
            _this.showMessages(tconn_promet.content);
        }
    }
    taskProto.showGuide = function () {
        var prompt_guide = new Array();
        var prompt_guide_default = new Array();
        var is_match = false;
        var m_prompt_guide_list = _this.m_prompt_guide_list;
        for (var i = 0; i < m_prompt_guide_list.length; i++) {
            var prompt_guide_i = m_prompt_guide_list[i].prompt;
            if (m_prompt_guide_list[i].title == "其他") {
                prompt_guide_default = prompt_guide_i;
                continue;
            }
            if (typeof m_prompt_guide_list[i].promote_link != "undefined" && m_prompt_guide_list[i].promote_link != "") {
                try {
                    if (_this.landpage != "" && m_prompt_guide_list[i].link_init != "" && _this.landpage.indexOf(m_prompt_guide_list[i].link_init) !== -1) {
                        prompt_guide = prompt_guide_i;
                        is_match = true;
                        break;
                    }
                } catch (e) {
                }
            } else {
                if (_this.keyword != "" && (m_prompt_guide_list[i].title.toLowerCase().indexOf(_this.keyword.toLowerCase()) !== -1 || _this.keyword.toLowerCase().indexOf(m_prompt_guide_list[i].title.toLowerCase()) !== -1)) {
                    prompt_guide = prompt_guide_i;
                    is_match = true;
                    break;
                }
            }
        }
        if (is_match === false) prompt_guide = prompt_guide_default;
        if (prompt_guide.length == 0) {
            return;
        }
        _this.showPrompt(prompt_guide);
    }
    taskProto.showMessages = function (connect_promet) {
        if (typeof connect_promet.length == "undefined" || connect_promet.length <= 0) {
            return;
        }
        _this.showPrompt(connect_promet);
    }
    taskProto.showPrompt = function (prompt) {
        for (var i = 0; i < prompt.length; i++) {
            if (typeof prompt[i].type == "undefined") prompt[i].type = 'message';
            prompt[i].content = prompt[i].prompt_content;
            prompt[i].isConnPrompt = 1;
        }
        var prompt_task = {id: '0', title: '开场白', parent_id: '0', answer: prompt, question: []};
        _this.inConnPrompt = true;
        if (_this.is_continue_task == 1) {
            _this.now_task = prompt_task;
        } else {
            _this.isMatchHandle(prompt_task);
        }
        return;
        var num = parseInt(_this.prompt_guide_size) + 1;

        function set_time_robot_prompt() {
            if (prompt.length > 0) {
                _this.kfShow(prompt[num].prompt_content.replace(/\\"/ig, '"'), _this.now_task, _this.answer_show_index, _this.index_times, num);
            } else {
                return;
            }
            num++;
            _this.prompt_guide_size = num;
            if (num >= prompt.length) {
                _this.prompt_guide_size = -1;
                _this.kfShow("", _this.now_task, _this.answer_show_index, _this.index_times, _this.prompt_guide_size);
                return;
            }
            if (typeof prompt[num].type != "undefined" && prompt[num].type == 'ask_option') {
                _this.showOption(prompt.option);
                return
            }
            if (num < _this.prompt_guide_size) var next_time = num * 50; else var next_time = parseInt(prompt[num].time) * 1000 + num * 50;
            _this.prompt_guide_timer = setTimeout(set_time_robot_prompt, next_time);
        }

        if (typeof prompt[num] != "undefined" && typeof prompt[num].time != "undefined") var prompt_guide_time = parseInt(prompt[num].time) * 1000; else var prompt_guide_time = 0;
        _this.prompt_guide_timer = setTimeout(set_time_robot_prompt, prompt_guide_time);
    }
    taskProto.backRobotGuide = function () {
        if (_this.prompt_guide_size != -1) {
            _this.prompt_guide_size = -1;
            _this.kfShow("", _this.now_task, _this.answer_show_index, _this.index_times, _this.prompt_guide_size);
        }
        if (_this.prompt_guide_timer) clearTimeout(_this.prompt_guide_timer);
        if (_this.no_talk_timer) clearTimeout(_this.no_talk_timer);
        if (_this.inConnPrompt == true) {
            _this.inConnPrompt = false;
            try {
                clearTimeout(_this.showMsgProcessTimer);
                _this.in_show_answer = false;
            } catch (e) {
            }
        }
    }
    taskProto.handleMsg = function (msg) {
        if (!_this.checkUse()) return;
        if (!_this.is_create) {
            _this.unMatch();
            return;
        }
        msg = msg.replace(/<[^>]+>/g, "");
        if (msg == "" || _this.in_show_answer) return;
        if (_this.no_talk_timer) clearTimeout(_this.no_talk_timer);
        if (_this.answer_show_index == 0) {
            if (_this.task_type == "match_first") _this.handleQaMsg(msg); else if (_this.task_type == "keyword_first") _this.handleQaMsgByKw(msg);
        } else {
            _this.handleAnswerMsg(msg);
        }
    }
    taskProto.handleQaMsg = function (msg) {
        var keyword_obj = {};
        var now_tasks = {};
        var text_ids = "";
        for (var i = 0; i < _this.now_task_list.length; i++) {
            var now_task = _this.now_task_list[i];
            var use_id = now_task.link_id == 0 ? now_task.id : now_task.link_id;
            now_tasks[use_id] = now_task;
            var now_keywords = [];
            try {
                if (now_task.question.length > 0) {
                    for (var j = 0; j < now_task.question.length; j++) {
                        if (now_task.question[j].type == "match") {
                            var is_match = _this.handleMatch(now_task.question[j].regular, msg);
                            if (is_match) {
                                _this.isMatchHandle(now_task);
                                return true;
                            }
                        }
                        if (now_task.question[j].type == "keyword") {
                            now_keywords.push(now_task.question[j].regular);
                        }
                    }
                }
                keyword_obj[i] = now_keywords;
                text_ids = text_ids == "" ? use_id : text_ids + ',' + use_id;
            } catch (e) {
                console.log(e);
                continue;
            }
        }
        for (var p in keyword_obj) {
            try {
                var now_keywords = keyword_obj[p];
                for (var k = 0; k < now_keywords.length; k++) {
                    if (msg.toLowerCase().indexOf(now_keywords[k].toLowerCase()) !== -1) {
                        _this.isMatchHandle(_this.now_task_list[p]);
                        return true;
                    }
                }
            } catch (e) {
                console.log(e);
                continue;
            }
        }
        if (text_ids != "") {
            $.ajax({
                url: _this.robot_url,
                data: {cmd: "UQR", zsk_ids: text_ids, company_id: _this.company_id, question: msg},
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                    if (data.task_id != 0) {
                        _this.isMatchHandle(now_tasks[data.task_id]);
                    } else {
                        _this.unMatch();
                    }
                },
                error: function () {
                    _this.unMatch();
                }
            });
        } else {
            _this.unMatch();
        }
    }
    taskProto.handleQaMsgByKw = function (msg) {
        var keyword_obj = {};
        var now_tasks = {};
        var text_ids = "";
        for (var i = 0; i < _this.now_task_list.length; i++) {
            var now_task = _this.now_task_list[i];
            var use_id = now_task.link_id == 0 ? now_task.id : now_task.link_id;
            now_tasks[use_id] = now_task;
            var now_keywords = [];
            try {
                if (now_task.question.length > 0) {
                    for (var j = 0; j < now_task.question.length; j++) {
                        if (now_task.question[j].type == "keyword") {
                            if (msg.indexOf(now_task.question[j].regular) !== -1) {
                                _this.isMatchHandle(now_task);
                                return true;
                            }
                        }
                        if (now_task.question[j].type == "match") {
                            now_keywords.push(now_task.question[j].regular);
                        }
                    }
                }
                keyword_obj[i] = now_keywords;
                text_ids = text_ids == "" ? use_id : text_ids + ',' + use_id;
            } catch (e) {
                console.log(e);
                continue;
            }
        }
        for (var p in keyword_obj) {
            try {
                var now_keywords = keyword_obj[p];
                for (var k = 0; k < now_keywords.length; k++) {
                    var is_match = _this.handleMatch(now_keywords[k], msg);
                    if (is_match) {
                        _this.isMatchHandle(_this.now_task_list[p]);
                        return true;
                    }
                }
            } catch (e) {
                console.log(e);
                continue;
            }
        }
        if (text_ids != "") {
            $.ajax({
                url: _this.robot_url,
                data: {cmd: "UQR", zsk_ids: text_ids, company_id: _this.company_id, question: msg},
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                    if (data.task_id != 0) {
                        _this.isMatchHandle(now_tasks[data.task_id]);
                    } else {
                        _this.unMatch();
                    }
                },
                error: function () {
                    _this.unMatch();
                }
            });
        } else {
            _this.unMatch();
        }
    }
    taskProto.handleAnswerMsg = function (msg) {
        try {
            if (_this.answer_show_index != 0 && typeof _this.now_task["answer"][_this.answer_show_index - 1] != "undefined") {
                var answer = _this.now_task["answer"][_this.answer_show_index - 1];
                if (answer.type == "question") {
                    var is_match = _this.handleMatch(answer.regular, msg);
                    if (is_match || answer.count == 0) {
                        _this.answer_show_index++;
                        _this.index_times = 0;
                        _this.last_msg = "";
                        _this.isMatchHandle(_this.now_task);
                    } else {
                        _this.qaAnsUnMatch(answer);
                    }
                } else {
                    if (_this.answer_show_index < _this.now_task["answer"].length) {
                        _this.answer_show_index++;
                        _this.handleAnswerMsg(msg);
                    } else {
                        _this.unMatch();
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    taskProto.qaAnsUnMatch = function (answer) {
        if (_this.index_times == -1) {
            _this.last_msg = answer.content;
            var list_data = _this.getListData(answer, _this.now_task, "in_answer");
            _this.showMsgProcess(list_data);
        } else if (_this.index_times < answer.count) {
            _this.index_times++;
            _this.last_msg = answer.content;
            var list_data = _this.getListData(answer, _this.now_task, "in_answer");
            if (_this.index_times >= answer.count) list_data.qa_times = "last";
            _this.showMsgProcess(list_data);
        } else {
            _this.unMatch();
        }
    }
    taskProto.repeatedQa = function (answer) {
        if (answer.type != "question") return;
        if (_this.no_talk_timer) clearTimeout(_this.no_talk_timer);
        if (answer.overtime == undefined) answer.overtime = 180;
        if (answer.overtime > 0) {
            _this.no_talk_timer = setTimeout(function () {
                _this.qaAnsUnMatch(answer);
            }, answer.overtime * 1000);
        }
    }
    taskProto.isMatch = function (now_task) {
        try {
            if (_this.answer_show_index <= now_task.answer.length) {
                var start_i = _this.answer_show_index == 0 ? 0 : _this.answer_show_index - 1;
                for (var i = start_i; i < now_task.answer.length; i++) {
                    var answer = now_task.answer[i];
                    _this.answer_show_index = i + 1;
                    if (answer.type == "message" || answer.type == "ask_option") {
                        _this.last_msg = answer.content;
                        _this.setLastAnswer(i, now_task);
                        var list_data = _this.getListData(answer, _this.now_task, "is_match");
                        _this.showMsgProcess(list_data);
                        if (answer.type == "ask_option") break;
                    }
                    if (answer.type == "question") {
                        _this.last_msg = answer.content;
                        if (answer.count == -1) _this.index_times = -1;
                        if (answer.count != -1 && answer.count != 0 && _this.index_times >= answer.count) _this.setLastAnswer(i, now_task);
                        var list_data = _this.getListData(answer, _this.now_task, "is_match");
                        _this.showMsgProcess(list_data);
                        break;
                    }
                    if (answer.type == "tokf") {
                        _this.last_msg = "";
                        _this.setLastAnswer(i, now_task);
                        var list_data = _this.getListData(answer, _this.now_task, "is_match");
                        _this.showMsgProcess(list_data);
                        break;
                    }
                    if (answer.type == "end") {
                        _this.closeTask();
                        break;
                    }
                }
            } else {
                _this.answer_show_index = 0;
                var use_id = _this.now_task.link_id == 0 ? _this.now_task.id : _this.now_task.link_id;
                if (typeof _this.task_robot.guide_content[use_id] == "undefined") {
                    _this.last_msg = "";
                    _this.now_task = {};
                }
                _this.removeLoading();
                _this.kfShow("", _this.now_task, _this.answer_show_index, _this.index_times);
            }
        } catch (e) {
            _this.answer_show_index = 0;
            console.log(e);
        }
    }
    taskProto.closeTask = function () {
        _this.is_use = false;
        if (_this.prompt_guide_timer) clearTimeout(_this.prompt_guide_timer);
        if (_this.no_talk_timer) clearTimeout(_this.no_talk_timer);
        _this.endTask();
    }
    taskProto.setLastAnswer = function (index, now_task) {
        if (index == (now_task.answer.length - 1)) {
            _this.answer_show_index = 0;
            var use_id = _this.now_task.link_id == 0 ? _this.now_task.id : _this.now_task.link_id;
            if (typeof _this.task_robot.guide_content[use_id] == "undefined") {
                _this.last_msg = "";
                _this.now_task = {};
            }
        }
    }
    taskProto.isMatchHandle = function (now_task) {
        _this.now_task = now_task;
        _this.isMatch(now_task);
        var use_id = _this.now_task.link_id == 0 ? _this.now_task.id : _this.now_task.link_id;
        if (typeof _this.task_robot.guide_content[use_id] == "undefined") {
            _this.now_task_list = _this.first_task_list;
        } else {
            _this.now_task_list = _this.task_robot.guide_content[use_id];
        }
    }
    taskProto.turnKf = function () {
        _this.breakNowTask();
        _this.connectKf();
    }
    _this.breakNowTask = function (link_id) {
        if (link_id == undefined) {
            _this.now_task_list = _this.first_task_list;
            _this.now_task = {};
            _this.intype = "question";
            _this.answer_show_index = 0;
            _this.index_times = 0;
        } else {
            for (var p in _this.task_robot.guide_content) {
                for (var i = 0; i < _this.task_robot.guide_content[p].length; i++) {
                    if (_this.task_robot.guide_content[p][i].id == link_id) {
                        _this.isMatchHandle(_this.task_robot.guide_content[p][i]);
                    }
                }
            }
        }
    }
    taskProto.unMatch = function () {
        if (typeof _this.now_task.un_answer == "undefined" || _this.now_task.un_answer == "") {
            var un_answer = _this.task_un_answer;
        } else {
            var un_answer = _this.now_task.un_answer;
        }
        _this.breakNowTask();
        _this.showUnMatch(un_answer);
        _this.callbackUnMatch();
    }
    taskProto.showUnMatch = function (un_answer) {
        _this.last_msg = "";
        for (var i = 0; i < un_answer.length; i++) {
            var list_data = _this.getListData(un_answer[i], _this.now_task, "un_answer");
            _this.showMsgProcess(list_data);
        }
    };
    taskProto.showLastMsg = function () {
        if (_this.last_msg != "" && !_this.in_show_answer && _this.checkUse()) {
            _this.kfShow(_this.last_msg, _this.now_task, _this.answer_show_index, _this.index_times);
        }
    }
    taskProto.handleMatch = function (regular, match_msg) {
        match_msg = '-' + match_msg;
        switch (regular) {
            case"mobile":
                if (match_msg.match(/[^\d](1[3-9]\d{9})(?!\d)/gi) || match_msg.match(/[^\d](0\d{2,3}-?\d{7,8})(?!\d)/gi)) {
                    return true;
                }
                break
            case"wechat":
                if (match_msg.match(/[^A-Za-z][A-Za-z](\w|-){5,19}(?![\w#])/gi) || match_msg.match(/[^\d](1[3-9]\d{9})(?!\d)/gi)) {
                    return true;
                }
                break;
            case"qq":
                if (match_msg.match(/[^\d](\d{5,12})(?!\d)/gi)) {
                    return true;
                }
                break;
            case"email":
                if (match_msg.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi)) {
                    return true;
                }
                break;
            case"num":
                if (match_msg.match(/\d+/gi)) {
                    return true;
                }
                break;
            case"url":
                if (match_msg.match(/([^{\/])((ftp:\/\/|https:\/\/|http:\/\/|www\d{0,4}\.)[\w\-]*\.[\w!~;*'()&=\+\$%\-\/\#\?:\.,\|\^]*)/gim)) {
                    return true;
                }
                break;
            case"surname":
                if (match_msg.match(/赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福|南/gim)) {
                    return true;
                }
                break;
            case"area":
                if (match_msg.match(/河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|北京|广州|深圳|长沙|成都|重庆|福州|贵阳|海口|杭州|昆明|南昌|南京|三亚|上海|沈阳|温州|武汉|厦门|西安|郑州|汕头|太原|天津|乌鲁木齐|义乌|湛江|长春|大连|桂林|哈尔滨|合肥|济南|南宁|宁波|青岛|佳木斯|牡丹江|延吉|呼和浩特|石家庄|邯郸|邢台|保定|张家口|承德|廊坊|唐山|秦皇岛|沧州|衡水|太原|大同|阳泉|长治|晋城|朔州|吕梁|忻州|晋中|临汾|运城|呼和浩特|包头|乌海|赤峰|呼伦贝尔盟|阿拉善盟|哲里木盟|兴安盟|乌兰察布盟|锡林郭勒盟|巴彦淖尔盟|伊克昭盟|沈阳|大连|鞍山|抚顺|本溪|丹东|锦州|营口|阜新|辽阳|盘锦|铁岭|朝阳|葫芦岛|长春|吉林|四平|辽源|通化|白山|松原|白城|延边|哈尔滨|齐齐哈尔|牡丹江|佳木斯|大庆|绥化|鹤岗|鸡西|黑河|双鸭山|伊春|七台河|大兴安岭|南京|镇江|苏州|南通|扬州|盐城|徐州|连云港|常州|无锡|宿迁|泰州|淮安|杭州|宁波|温州|嘉兴|湖州|绍兴|金华|衢州|舟山|台州|丽水|合肥|芜湖|蚌埠|马鞍山|淮北|铜陵|安庆|黄山|滁州|宿州|池州|淮南|巢湖|阜阳|六安|宣城|亳州|福州|厦门|莆田|三明|泉州|漳州|南平|龙岩|宁德|南昌|景德镇|九江|鹰潭|萍乡|新馀|赣州|吉安|宜春|抚州|上饶|济南|青岛|淄博|枣庄|东营|烟台|潍坊|济宁|泰安|威海|日照|莱芜|临沂|德州|聊城|滨州|菏泽|郑州|开封|洛阳|平顶山|安阳|鹤壁|新乡|焦作|濮阳|许昌|漯河|三门峡|南阳|商丘|信阳|周口|驻马店|济源|武汉|宜昌|荆州|襄樊|黄石|荆门|黄冈|十堰|恩施|潜江|天门|仙桃|随州|咸宁|孝感|鄂州|长沙|常德|株洲|湘潭|衡阳|岳阳|邵阳|益阳|娄底|怀化|郴州|永州|湘西|张家界|广州|深圳|珠海|汕头|东莞|中山|佛山|韶关|江门|湛江|茂名|肇庆|惠州|梅州|汕尾|河源|阳江|清远|潮州|揭阳|云浮|南宁|柳州|桂林|梧州|北海|防城港|钦州|贵港|玉林|南宁|柳州|贺州|百色|河池|海口|三亚|三沙|成都|绵阳|德阳|自贡|攀枝花|广元|内江|乐山|南充|宜宾|广安|达川|雅安|眉山|甘孜|凉山|泸州|贵阳|六盘水|遵义|安顺|铜仁|黔西南|毕节|黔东南|黔南|昆明|大理|曲靖|玉溪|昭通|楚雄|红河|文山|思茅|西双版纳|保山|德宏|丽江|怒江|迪庆|临沧|拉萨|日喀则|山南|林芝|昌都|阿里|那曲|西安|宝鸡|咸阳|铜川|渭南|延安|榆林|汉中|安康|商洛|兰州|嘉峪关|金昌|白银|天水|酒泉|张掖|武威|定西|陇南|平凉|庆阳|临夏|甘南|银川|石嘴山|吴忠|固原|西宁|海东|海南|海北|黄南|玉树|果洛|海西|乌鲁木齐|石河子|克拉玛依|伊犁|巴音郭勒|昌吉|克孜勒苏柯尔克孜|博尔塔拉|吐鲁番|哈密|喀什|和田|阿克苏|香港|澳门|台北|"/gim)) {
                    return true;
                }
                if (match_msg.match(/.+?(省|市|自治区|自治州|县|区)/gim)) {
                    return true;
                }
                break;
            case"any":
                return true;
                break;
        }
        return false;
    }
    taskProto.showMsgProcess = function (list_data, type) {
        if (type == undefined) var type = false;

        function showMsgProcess(list_data, type) {
            if (type == undefined) var type = false;
            if (typeof list_data.answer.time == "undefined" || list_data.type == "in_answer") {
                list_data.answer.time = 0;
            }
            if (_this.in_show_answer && !type) {
                _this.prepare_msg_list.push(list_data);
            } else {
                if (typeof list_data.answer.isConnPrompt != "undefined" && list_data.answer.isConnPrompt == 1 && !_this.inConnPrompt) {
                    if (_this.prepare_msg_list.length > 0) {
                        list_data = _this.prepare_msg_list.shift();
                        showMsgProcess(list_data, true);
                    } else {
                        _this.in_show_answer = false;
                    }
                    return;
                }
                _this.in_show_answer = true;
                _this.addLoading();
                _this.showMsgProcessTimer = setTimeout(function () {
                    try {
                        _this.removeLoading();
                        switch (list_data.type) {
                            case"is_match":
                                if (list_data.answer.type == "tokf") {
                                    _this.turnKf();
                                    _this.kfShow("", _this.now_task, _this.answer_show_index, _this.index_times);
                                } else {
                                    _this.kfShow(list_data.answer.content, list_data.now_task, list_data.answer_show_index, list_data.index_times);
                                    if (list_data.answer.type == "ask_option") {
                                        _this.showOption(list_data.answer.option);
                                    }
                                }
                                break;
                            case"in_answer":
                                _this.kfShow(list_data.answer.content, list_data.now_task, list_data.answer_show_index, list_data.index_times);
                                break;
                            case"un_answer":
                                if (list_data.answer.type == "tokf") {
                                    _this.turnKf();
                                } else {
                                    _this.kfShow(list_data.answer.content, list_data.now_task, list_data.answer_show_index, list_data.index_times);
                                }
                                break;
                        }
                        if (list_data.answer.type == "question") {
                            if (list_data.answer.count != 0 && list_data.qa_times != "last") _this.repeatedQa(list_data.answer);
                        }
                        if (_this.prepare_msg_list.length > 0) {
                            list_data = _this.prepare_msg_list.shift();
                            showMsgProcess(list_data, true);
                        } else {
                            _this.in_show_answer = false;
                        }
                    } catch (e) {
                        console.log(e);
                        _this.in_show_answer = false;
                    }
                }, list_data.answer.time * 1000);
            }
        }

        showMsgProcess(list_data, type);
    }
    taskProto.deepCopy = function (source) {
        function deepCopy(source) {
            var result = {};
            for (var key in source) {
                result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
            }
            return result;
        }

        return deepCopy(source);
    }
    taskProto.getListData = function (answer, now_task, type) {
        var list_data = {
            "answer": answer,
            "now_task": _this.deepCopy(now_task),
            "answer_show_index": _this.answer_show_index,
            "index_times": _this.index_times,
            "type": type
        };
        return list_data;
    }
    taskProto.kfShow = function (msg, now_task, show_index, times, prompt_guide_size) {
    };
    taskProto.connectKf = function () {
    };
    taskProto.endTask = function () {
    };
    taskProto.addLoading = function () {
    };
    taskProto.removeLoading = function () {
    };
    taskProto.showOption = function (options) {
    };
    taskProto.callbackUnMatch = function () {
    };
};var imfocus = 1;
var lnkover = 0;
var obj_name = "";
var m_joinNames = [];
var sendtyptime = 0;
var settyptime = 0;
var typtime = 8;
var sendtyp_type = 0;
var typcontent = "";
var m_typTimer = 0;
var m_autoTimer = 0;
var m_leftTime = 0;
var m_noTalkTimer = 0;
var m_kfNoTalkTimer = 0;
var m_ImKfNoTalkTimer = 0;
var m_refreshTimer = 0;
var isSendLNK = false;
var sendlnktimes = 0;
var m_qstResTimer = 0;
var g_comm = null;
var m_busyCnt = 0;
var m_clickLink = false;
var sendLNKTimes = 0;
var CONST_NOTALK_TIP = 0;
var CONST_NOTALK_OVER = 180;
var noTalkNum = 0;
var noTalkOver = 0;
var CONST_KF_NOTALK_TIP = 0;
var kfNoTalkNum = 0;
var ImKfNoTalkNum = 0;
var m_startInitial = false;
var closemark = "beidong";
var m_requestVote = false;
var talk_type = 0;
var origin_type = 0;
var origin_time = 0;
var isoldkf = 0;
var khnumber = 1;
var m_checkCodeType = 0;
var prompt_guide_timer = 0;
var isset_prompt_cookie = 0;
var is_show_prompt = false;
var msg_wait_arr = new Array();
var is_swh = 0;
var custom_auto_update = {"qq": 0, "wechat": 0};
var custom_wechat_update = 0;
var web_msg_talk_id = [];
var is_sceneToTalk = false;
var task_robot_obj = new Object;
var is_robotToTalk = false;
var robotTipsTime = 0;
var m_robid = '';
var zsk_name = '';
var zsk_prompt = '';
var zsk_un_prompt = '';
var zsk_zsktb_url = '';
var zsk_zdzrg = '';
var zsk_unret_times = '';
var zsk_admit_rule = '';
var zsk_kw_trans = '';
var zsk_api_robot_id = '';
var zsk_api_name = '';
var zsk_vars = [];
var zsk_feedback = '';
var zsk_hots = '';
var robot_cannot_answer_times = 0;
var robot_unshow_msg = 0;
var m_isShowInertactMenu = false;
var lwordSuccessTimer = 0;

function initial() {
    if (m_startInitial) return;
    m_startInitial = true;
    try {
        document.cookie = "hz6d_open_talk_" + company_id + "=1";
    } catch (e) {
    }
    init_comm();
    set_myid();
    is_cswh();
    if (checkFireWall()) {
        if (hasOnlineKf == '1') {
            top.postMessage('get_force', '*');
            setOnLine(true);
        } else {
            setOffLine();
        }
    }
    try {
        sendkafka("talk_info", "1");
    } catch (e) {
    }
}

function checkFireWall() {
    if (fire_set == '1' && fire_level >= 1) {
        if (checkCookie() === false) is_verify = '1';
        if (is_verify == '1') {
            if (verify_code == 0) {
                changeModule('stop');
            } else {
                m_checkCodeType = 1;
                createCodeFreeze(myid, 1, company_id);
            }
            return false;
        }
    }
    return true;
}

function set_myid() {
    var c_guestid = getCookie("guest_id", 'u');
    var l_guestid = '';
    try {
        l_guestid = localStorage['53kf_guest_id'];
    } catch (e) {
    }
    if (is_get_guest_id == '2') {
        myid = guest_id;
    } else {
        myid = guest_id_from_get || l_guestid || c_guestid || guest_id;
    }
    if (myid != parseInt(myid)) myid = 0;
    try {
        localStorage['53kf_guest_id'] = myid;
    } catch (e) {
    }
    if (is_get_guest_id == '1') {
        try {
            getFingerGid(0);
        } catch (e) {
        }
    }
}

function is_cswh() {
    var iscswh = getUrlParams('iscswh');
    if (iscswh == '1') {
        robotassign = 0;
        reg = 0;
        kflist = 'off';
    }
}

function setOnLine(checkreg) {
    if (checkreg) {
        if (reg == '1' && is_reg != '1') {
            changeModule('reg');
            return;
        }
    }
    if (kflist == 'on') {
        showKfList();
        if (zdkf_auto != 'off') {
            m_leftTime = zdkf_auto;
            autoLink();
            m_autoTimer = setInterval("autoLink()", 1000);
        }
    } else {
        if (robotassign == '1' && robot_id != '') {
            showzsk(robot_id);
            return;
        }
        if (robotassign == '2' && prompt_cookie == '') {
            showPromptGuide();
            if (!m_isShowInertactMenu) {
                m_isShowInertactMenu = true;
                try {
                    menu.init(pc_inertact_menu);
                } catch (e) {
                }
            }
            return;
        }
        if (robotassign == '3' && scene_cookie == '') {
            setSceneGuide();
            return;
        }
        robotassign = '0';
        sendLNK();
    }
}

function setOffLine() {
    if (kflist == 'on') {
        if (robot_id != '') {
            showzsk(robot_id);
            return;
        }
    } else {
        if (frobotassign == '1' && frobot_id != '') {
            showzsk(frobot_id);
            return;
        }
        if (frobotassign == '2' && scene_cookie == '') {
            setSceneGuide();
            return;
        }
    }
    showLword();
}

function to_kf(wid, is_online) {
    if (m_clickLink) return;
    m_clickLink = true;
    hiddenAutoLink();
    worker_ids = wid;
    if (is_online == 1) {
        sendLNK();
    } else {
        showLword();
    }
}

function autoLink() {
    if (m_leftTime < 0) {
        hiddenAutoLink();
        sendLNK();
    } else {
        showAutoLink(m_leftTime);
        m_leftTime--;
    }
}

function getFingerGid(times) {
    if (finger_id == "") {
        if (times < 3) {
            times++;
            setTimeout(function () {
                getFingerGid(times);
            }, 2000);
        } else {
            is_get_guest_id = '0';
        }
        return;
    }
    $.ajax({
        url: http_pro + finger_host + '/fingerprintjs?cmd=get&fn=' + finger_id,
        timeout: 5000,
        type: 'get',
        success: function (data) {
            if (data != "" && parseInt(data) > 0) {
                myid = parseInt(data);
                var today = new Date();
                var expires = new Date();
                expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 365 * 30);
                document.cookie = "finger_guest_id=" + escape(myid) + "; expires=" + expires.toGMTString() + ";domain=" + base_host;
                try {
                    localStorage['53kf_guest_id'] = myid;
                } catch (e) {
                }
            } else {
                if (myid > 0) $.get(http_pro + finger_host + '/fingerprintjs?cmd=set&fn=' + finger_id + "&guestid=" + myid, function () {
                }); else is_set_finger = 1;
            }
            is_get_guest_id = '0';
        },
        complete: function (XMLHttpRequest, status) {
            if (status == 'timeout' || status == "error") {
                $.get("wnn_debug.php", {"type": "finger", "flag": "status", "info": status, "company_id": company_id});
            }
            is_get_guest_id = '0';
        }
    });
}

function sendLNK() {
    if (isSendLNK) return;
    if (is_get_guest_id == '1' && sendLNKTimes < 12) {
        sendLNKTimes++;
        setTimeout(function () {
            sendLNK();
        }, 500);
        return;
    }
    if (prompt_guide_timer) clearTimeout(prompt_guide_timer);
    try {
        wait_client.closeLink();
    } catch (e) {
    }
    try {
        task_robot_obj.backRobotGuide();
        robot_client.closeLink(true);
    } catch (e) {
    }
    var now_time = Date.parse(new Date()) / 1000;
    if (now_time - lnkopentime > 540) {
        refreshLNK();
        return;
    }
    isSendLNK = true;
    g_comm.SetKhInfo(myid, UrlEncode(HtmlDecode(frompage)), UrlEncode(HtmlDecode(talkpage)), UrlEncode(talktitle), UrlEncode(lnk_param), tfrom, search_engine, UrlEncode(keyword), UrlEncode(HtmlDecode(landpage)));
    g_comm.OpenLink(company_id, worker_ids, 0, UrlEncode(UBBEncode(conn_prompt)));
    m_refreshTimer = setTimeout("refreshLNK()", 20000);
    if (origin_type == '1') {
        sendkafka('type', '1', '-1', origin_time);
        origin_type = 0;
    }
}

function refreshLNK() {
    sendlnktimes++;
    if (sendlnktimes > 3) return;
    $.ajax({
        url: 'get_firewall.php?type=m_new&company_id=' + company_id + "&guest_id=" + myid,
        timeout: 5000,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            firewall_uuid = data.firewall_uuid;
            lnk_param = data.lnk_param;
            lnk_fire = data.lnk_fire;
            lnkopentime = Date.parse(new Date()) / 1000;
            sendLNK();
        },
        complete: function (XMLHttpRequest, status) {
            if (status == 'timeout' || status == "error") {
                lnkFailProc();
            }
        }
    });
}

function setGuestId() {
    if (is_get_guest_id == 0) {
        var today = new Date();
        var expires = new Date();
        expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 365 * 30);
        document.cookie = "guest_id=" + escape(myid) + "; expires=" + expires.toGMTString() + ";domain=" + base_host;
    }
    if (is_set_finger) {
        try {
            $.get(http_pro + finger_host + '/fingerprintjs?cmd=set&fn=' + finger_id + "&guestid=" + myid, function () {
            });
        } catch (e) {
        }
    }
}

function showConnPrompt() {
    var prompt_count = 1, first_prompt = '', carousel_count = 1;
    if (conn_prompt_list[obj_id] != undefined && conn_prompt_list[obj_id] != null) {
        info_list = conn_prompt_list[obj_id];
        if (typeof info_list.carousel != "undefined" && info_list.carousel == 1) {
            try {
                clearTimeout(carousel_id);
            } catch (e) {
            }

            function check_prmopt() {
                if (lnkover != 1) {
                    clearTimeout(carousel_id);
                    return;
                }
                var prompt = eval("info_list.carousel_prompt" + prompt_count);
                if (typeof prompt != "undefined" && prompt != null && prompt.replace(/&nbsp;/g, "").trim() != "") {
                    conn_prompt_num = prompt_count;
                    if (!first_prompt) {
                        first_prompt = prompt;
                    } else {
                        display_kf_msg(UBBCode(UBBEncode(prompt)), undefined, '');
                        playSound();
                        g_comm.SendConnPrompt(UrlEncode(UBBEncode(prompt)));
                    }
                    prompt_count++;
                    if (info_list['carousel_time' + prompt_count]) {
                        carousel_id = setTimeout(check_prmopt, info_list['carousel_time' + prompt_count] * 1000);
                    } else {
                        carousel_id = setTimeout(check_prmopt, info_list['carousel_time1'] * 1000);
                    }
                } else {
                    prompt_count++;
                    if (prompt_count > 8) {
                        prompt_count = 1;
                        carousel_count++;
                        if (carousel_count > info_list.carousel_num) {
                            return;
                        }
                    }
                    check_prmopt();
                }
            }

            check_prmopt();
        } else {
            first_prompt = info_list.conn_prompt.replace(/&nbsp;/g, "").trim();
        }
    }
    if (first_prompt == '') first_prompt = conn_prompt;
    if (first_prompt != '') {
        display_kf_msg(UBBCode(UBBEncode(first_prompt)), undefined, '');
        playSound();
    }
}

function getKfPrompt(type) {
    var prompt = '';
    var default_prompt = '';
    if (type == "close_prompt") {
        prompt = close_prompt_list[obj_id];
        default_prompt = close_prompt;
    } else if (type == "busy_prompt") {
        prompt = busy_prompt_list[obj_id];
        default_prompt = kf_auto_tip_phrase;
    }
    if (prompt == '' || prompt == undefined) return default_prompt;
    return prompt;
}

function getKfPromptTime() {
    var busy_prompt_time = busy_prompt_time_list[obj_id];
    if (busy_prompt_time == '' || busy_prompt_time == undefined || busy_prompt_list[obj_id] == '' || busy_prompt_list[obj_id] == undefined) {
        busy_prompt_time = kf_auto_tip == '0' ? '1800' : kf_auto_tip;
    }
    return busy_prompt_time;
}

function showPromptGuide() {
    if (is_show_prompt === true) return;
    is_show_prompt = true;
    if (adminHeaderUrl != '') kf_header = adminHeaderUrl;
    if (typeof kefuCodeList[adminId6d] == 'undefined') {
        admin_wx_code = '';
    } else {
        admin_wx_code = kefuCodeList[adminId6d];
    }
    changeModule('talk');
    lnkover = 6;
    try {
        wait_client.setParams(http_pro, wait_host, UrlEncode(HtmlDecode(talkpage)), UrlEncode(HtmlDecode(frompage)), search_engine, keyword, UrlEncode(HtmlDecode(landpage)), tfrom, is_group, open_time, uid, myid);
        wait_client.setCallBack("GID_CALL", function (gid) {
            myid = gid;
        });
        wait_client.init();
        var prompt_guide = new Array();
        var prompt_guide_default = new Array();
        var is_match = false;
        var is_talkpage_guide = false;
        var talkpage_de = HtmlDecode(talkpage);
        for (var i = 0; i < prompt_guide_list.length; i++) {
            var prompt_guide_i = prompt_guide_list[i].prompt;
            if (prompt_guide_list[i].title == "其他") {
                prompt_guide_default = prompt_guide_i;
                continue;
            }
            if (typeof prompt_guide_list[i].promote_link != "undefined" && prompt_guide_list[i].promote_link != "") {
                try {
                    if (landpage != "" && prompt_guide_list[i].link_init != "" && landpage.indexOf(prompt_guide_list[i].link_init) !== -1) {
                        prompt_guide = prompt_guide_i;
                        is_match = true;
                        break;
                    }
                } catch (e) {
                }
            } else if (typeof prompt_guide_list[i].talkpage_link != "undefined" && prompt_guide_list[i].talkpage_link != "") {
                try {
                    if (talkpage_de != "" && prompt_guide_list[i].talkpage_link != "" && talkpage_de.indexOf(HtmlDecode(prompt_guide_list[i].talkpage_link)) !== -1) {
                        var prompt_guide_talkpage = decodeURIComponent(getCookie("prompt_guide_talkpage_" + company_id));
                        if (prompt_guide_size > 0 && prompt_guide_talkpage != talkpage_de) {
                            wait_client.sendStart();
                            prompt_guide_size = 0;
                        }
                        prompt_guide = prompt_guide_i;
                        is_match = true;
                        is_talkpage_guide = true;
                        document.cookie = "prompt_guide_talkpage_" + company_id + "=" + UrlEncode(talkpage_de);
                        break;
                    }
                } catch (e) {
                }
            } else {
                if (keyword != "" && (prompt_guide_list[i].title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || keyword.toLowerCase().indexOf(prompt_guide_list[i].title.toLowerCase()) !== -1)) {
                    prompt_guide = prompt_guide_i;
                    is_match = true;
                    break;
                }
            }
        }
        if (is_match === false) prompt_guide = prompt_guide_default;
        if (!is_talkpage_guide) {
            var prompt_guide_talkpage = getCookie("prompt_guide_talkpage_" + company_id);
            if (prompt_guide_size > 0 && prompt_guide_talkpage != '') {
                wait_client.sendStart();
                prompt_guide_size = 0;
            }
            document.cookie = "prompt_guide_talkpage_" + company_id + "=";
        }
        if (prompt_guide.length == 0) {
            sendLNK();
            return;
        }
        var num = 0;

        function set_time_prompt() {
            if (prompt_guide.length > 0) {
                playSound();
                display_kf_msg(UBBCode(UBBEncode(prompt_guide[num].prompt_content)), admin_bname);
                wait_client.sendRoa(UBBCode(UBBEncode(prompt_guide[num].prompt_content)), num + 1);
                try {
                    top.postMessage('53kf_new_msg', '*');
                } catch (e) {
                }
            } else {
                return;
            }
            num++;
            if (num >= prompt_guide.length) return;
            if (num < prompt_guide_size) var next_time = num * 50; else var next_time = parseInt(prompt_guide[num].time) * 1000 + num * 50;
            prompt_guide_timer = setTimeout(set_time_prompt, next_time);
        }

        if (prompt_guide_size == 0) var prompt_guide_time = parseInt(prompt_guide[num].time) * 1000; else var prompt_guide_time = 0;
        prompt_guide_timer = setTimeout(set_time_prompt, prompt_guide_time);
    } catch (e) {
    }
}

function setSceneGuide() {
    changeModule('scene');
    lnkover = 7;
    try {
        scene_client.setParams(http_pro, scene_host, UrlEncode(HtmlDecode(talkpage)), UrlEncode(HtmlDecode(frompage)), search_engine, UrlEncode(keyword), UrlEncode(HtmlDecode(landpage)), tfrom, is_group, open_time, myid, uid, ucust_id, u_stat_id);
        scene_client.setCallBack("GID_CALL", function (gid) {
            myid = gid;
        });
        scene_client.setCallBack("SLNK_CALL", function (steps_str) {
            if (steps_str != '' && steps_str != undefined) {
                var step_arr = steps_str.split(',');
                if (step_arr.length > scene_step_arr.length) {
                    scene_step_arr = step_arr;
                }
            }
        });
        scene_client.setCallBack("ROA_CALL", function (step, point) {
            if (step != '') {
                var step_temp = step.split('-');
                var option_id = step_temp[0];
                var num = step_temp[1];
                var option_cont = scene_guide_list[option_id].option_cont;
                var action = scene_guide_list[option_id].action;
                if (option_cont.length == num) {
                    if (action == 'tokf') {
                        offToTalk('scene');
                        scene_client.closeLink(true);
                    } else if (action == 'option') {
                        var point_num = step_temp[2];
                        var btn = scene_guide_list[option_id].option_btn[point_num];
                        if (btn) {
                            $('#' + 'scene_' + option_id + '_' + num).hide();
                            display_fk_msg(btn.name);
                            showSceneGuide(btn.point);
                        } else {
                            $.each(scene_guide_list[option_id].option_btn, function (i, v) {
                                if (v.point == point) {
                                    $('#' + 'scene_' + option_id + '_' + num).hide();
                                    display_fk_msg(v.name);
                                    showSceneGuide(point);
                                    return false;
                                }
                            });
                        }
                    }
                } else if (option_cont[num].type == 'form') {
                    $('#' + 'scene_' + option_id + '_' + num).removeClass("guide_f").html("发送成功");
                    showSceneGuide(option_id, parseInt(num) + 1);
                }
            }
        });
        scene_client.init();
    } catch (e) {
    }
    showSceneGuide(1);
}

function showSceneGuide(option_id, num) {
    if (adminHeaderUrl != '') kf_header = adminHeaderUrl;
    var option_cont = scene_guide_list[option_id].option_cont;
    var action = scene_guide_list[option_id].action;
    var option_btn = scene_guide_list[option_id].option_btn;
    if (num == undefined) num = 0;

    function show_scene() {
        if (option_cont.length > 0) {
            var scene_tmp = option_id + "-" + num;
            if (option_cont.length == num) {
                if (action != 'option') {
                    var time = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                    var expires = new Date();
                    expires.setTime(time);
                    document.cookie = "scene_guide_" + company_id + "=1; expires=" + expires.toGMTString();
                }
                if (action == 'tokf') {
                    offToTalk('scene');
                    scene_client.closeLink(true);
                } else if (action == 'option') {
                    var is_display = false;
                    $.each(scene_step_arr, function (i, v) {
                        if (v.indexOf(scene_tmp) !== -1) {
                            var btn_num = v.split('-')[2];
                            if (option_btn[btn_num]) {
                                display_fk_msg(option_btn[btn_num].name);
                                showSceneGuide(option_btn[btn_num].point);
                                is_display = true;
                                return false;
                            }
                        }
                    });
                    if (!is_display) {
                        playSound();
                        display_scene_option(option_btn, option_id, num);
                    }
                } else {
                    scene_client.closeLink(true);
                }
            } else {
                if (option_cont[num].type == 'message') {
                    playSound();
                    display_kf_msg(UBBCode(UBBEncode(option_cont[num].cont)), admin_bname);
                    if ($.inArray(scene_tmp, scene_step_arr) != -1) {
                        num++;
                        show_scene();
                    } else {
                        try {
                            scene_client.sendRoa(UrlEncode(UBBEncode(option_cont[num].cont)), scene_tmp, 'p');
                            num++;
                            setTimeout(function () {
                                show_scene();
                            }, 1000);
                        } catch (e) {
                        }
                    }
                } else {
                    if ($.inArray(scene_tmp, scene_step_arr) != -1) {
                        display_kf_msg('发送成功');
                        num++;
                        show_scene();
                    } else {
                        playSound();
                        display_scene_form(option_cont[num].cont, option_id, num);
                    }
                }
            }
        } else {
            sendLNK();
        }
    }

    show_scene();
}

function showLword() {
    lnkover = 3;
    changeModule('lword');
    g_comm.QuitWait();
    g_comm.ShutDown(true);
    handleCustMsg("lword");
}

function showzsk(rid) {
    hiddenAutoLink();
    if (rid === undefined) rid = robot_id;
    if (rid == '' || robotList[rid] == undefined) {
        if (hasOnlineKf == '1') {
            sendLNK();
        } else {
            showLword();
        }
        return;
    }
    m_robid = rid;
    zsk_name = robotList[rid].name;
    zsk_prompt = robotMsgReplace(robotList[rid].prompt);
    zsk_un_prompt = robotMsgReplace(robotList[rid].un_prompt);
    zsk_zsktb_url = robotList[rid].zsktb_url;
    zsk_zdzrg = robotList[rid].zdzrg;
    zsk_unret_times = robotList[rid].unret_times;
    zsk_admit_rule = robotList[rid].admit_rule;
    zsk_kw_trans = robotList[rid].kw_trans;
    zsk_api_robot_id = robotList[rid].api_robot_id;
    zsk_api_name = robotList[rid].api_name;
    zsk_vars = robotList[rid].vars;
    zsk_feedback = robotList[rid].feedback;
    task_robot_use = robotList[rid].task_robot_use;
    zsk_hots = robotList[rid].hots;
    if (typeof robotList[rid].task_robot_info != 'undefined') task_robot_info = robotList[rid].task_robot_info;
    changeModule('robot');
    g_comm.QuitWait();
    g_comm.ShutDown(true);
    lnkover = 4;
    var now = new Date();
    robotTipsTime = now.getTime() + 5000;
    robot_client.setParams(http_pro, robot_host, UrlEncode(HtmlDecode(talkpage)), UrlEncode(HtmlDecode(frompage)), search_engine, UrlEncode(keyword), UrlEncode(HtmlDecode(landpage)), tfrom, is_group, open_time, myid, uid, ucust_id, u_stat_id, UrlEncode(channel), m_robid, UrlEncode(zsk_name));
    if (typeof talk_robot_info["khnumber"] != "undefined" && guest_id != talk_robot_info["guest_id"]) {
        talk_robot_info["task_zsk_id"] = 0;
        talk_robot_info["index"] = 0;
    }
    robot_client.setCallBack("GID_CALL", function (gid) {
        myid = gid;
    });
    robot_client.setCallBack("RLNK_CALL", function () {
        myfirst_tempid = robot_client.first_tempid;
        if (typeof talk_robot_info["khnumber"] != "undefined") {
            robot_client.sendRqst();
        }
    });
    robot_client.setCallBack("RQST_CALL", function (list) {
        for (var i = 0; i < list.length; i++) {
            var type = list[i].type;
            if (type == 's') continue;
            if (i == 0 && task_robot_use == '0' && typeof talk_robot_info["khnumber"] != "undefined" && zsk_api_name != 'ly') {
                $("#robot_start").show();
                continue;
            }
            var msg = decodeURIComponent(list[i].msg);
            msg = UBBCode(msg);
            msg = msg.replace(/(<br>)/g, "<br>");
            msg = msg.replace(/\[voice\](.*?)\[\/voice\]/g, "<img style='cursor:pointer' src='../../style/setting/ver06/img/suspend/voice_tip.png'></img>");
            if (type == "p" || type == "u") {
                display_robot_answer(0, msg, '');
            } else {
                display_fk_msg(msg);
            }
        }
        task_robot_obj.taskContinue();
    });
    robot_client.setCallBack("ULN_CALL", function () {
        lnkover = 2;
        display_sys_msg(UBBCode(UBBEncode(getKfPrompt('close_prompt'))));
        $(".maskArea").show();
        kindeditor.html("");
    });
    robot_client.setCallBack("ZRG_CALL", function (workerid) {
        worker_ids = workerid;
        kflist = 'off';
        is_robotToTalk = true;
        sendLNK();
    });
    robot_client.setCallBack("RECEPTION_CALL", function (workerid) {
        worker_ids = workerid;
        kflist = 'off';
        lnk_overflow = 3;
        is_robotToTalk = true;
        isSendLNK = false;
        sendLNK();
    });
    if (task_robot_use == '0' && typeof talk_robot_info["khnumber"] == "undefined") {
        $("#robot_start").show();
        if (zsk_api_name == 'ly') {
            var question = "你好";
            if (keyword != "") {
                question = keyword;
            } else if (talkpage != "") {
            }
            $.ajax({
                url: "/client/clientRobot.php",
                dataType: "json",
                data: {
                    cmd: "UQR",
                    com_id: company_id,
                    robot_id: m_robid,
                    question: "<newchat>" + question,
                    "guest_id": myid,
                    "api_robot_id": zsk_api_robot_id,
                    "api_name": zsk_api_name
                },
                success: function (result) {
                    if (result != null && result["answer"] != "") {
                        var relation = "";
                        if (result["relation"].length > 0) {
                            relation = '<div class="question-lists"><ul class="questions">';
                            for (i = 0; i < result["relation"].length; i++) {
                                relation += '<li onmouseup="this.style.color=\'#62778C\'" onclick="dealRobotQa(\'' + result["relation"][i]["id"] + '\', \'' + result["relation"][i]["question"] + '\',\'' + result["relation"][i]["answer"] + '\')">' + result["relation"][i]["question"] + '</li>';
                            }
                            relation += '</ul></div>';
                        }
                        zsk_prompt = robotMsgReplace(result["answer"]) + relation;
                        $(".pc-robot-reply").html(zsk_prompt);
                    }
                    getClueByMsg(zsk_prompt, "w");
                    qstRobotMsg(zsk_prompt, "p");
                },
                error: function () {
                    getClueByMsg(zsk_prompt, "w");
                    qstRobotMsg(zsk_prompt, "p");
                }
            });
        } else {
            getClueByMsg(zsk_prompt, "w");
            qstRobotMsg(zsk_prompt, "p");
        }
    } else {
        $("#robot_start").hide();
    }
    createTaskRobot();
    handleCustMsg("robot");
    if (origin_type != '1') {
        talk_type = 3;
        sendkafka('type', '1', '1');
        origin_type = 1;
    }
}

function robotMsgReplace(msg) {
    if (msg == "") return "";
    for (var i = 0; i < zsk_vars.length; i++) {
        msg = msg.replace(zsk_vars[i].tag, zsk_vars[i].val);
    }
    return msg;
}

function createTaskRobot() {
    robot_client.init();
    task_robot_obj = new taskRobot();
    task_robot_obj.kfShow = function (msg, now_task, show_index, index_times, prompt_guide_size) {
        msg = robotMsgReplace(msg);
        if (msg != "") display_robot_answer(0, HtmlDecode(msg), '');
        var task_zsk_id = 0;
        var index = 0;
        var times = 0;
        if (typeof now_task.id != "undefined") {
            task_zsk_id = now_task.id;
            index = show_index;
            times = index_times;
        }
        guide_size = prompt_guide_size == undefined ? -1 : prompt_guide_size;
        getClueByMsg(msg, 'w');
        qstRobotMsg(msg, "p", task_zsk_id, index, times, guide_size);
    }
    task_robot_obj.connectKf = function () {
        offToTalk('robot');
    }
    task_robot_obj.endTask = function () {
        task_robot_use = 0;
    }
    task_robot_obj.addLoading = function () {
        try {
            showRobotLoad();
            robot_unshow_msg++;
        } catch (e) {
        }
    }
    task_robot_obj.removeLoading = function () {
        try {
            robot_unshow_msg--;
            removeRobotLoad();
        } catch (e) {
        }
    }
    task_robot_obj.showOption = function (options) {
        showTaskOption(options);
    }
    task_robot_obj.callbackUnMatch = function (options) {
        if (zsk_zdzrg == '1') {
            robot_cannot_answer_times += 1;
            if (robot_cannot_answer_times == zsk_unret_times) {
                offToTalk('robot');
                robot_cannot_answer_times = 0;
            }
        }
    }
    task_robot_obj.init(company_id, task_robot_info, task_robot_use, talk_robot_info, "", robot_prompt_guide, landpage, keyword, task_type);
}

function clickTaskOption(link_id, obj) {
    $(obj).parent().hide();
    var msg = $(obj).html();
    if (link_id == '0') {
        getRobotReply(msg);
    } else {
        display_fk_msg(UBBCode(UBBEncode(msg)));
        qstRobotMsg(msg, "g");
        task_robot_obj.breakNowTask(link_id);
    }
}

function handleCustMsg(type) {
    if (custmsg != "") {
        if (type == "lnk") {
            sendmsg(custmsg);
        } else if (type == "lword") {
            $("#ly_content").val(custmsg);
            $("#submit_lword").removeClass("prevent-send");
        } else if (type == "robot") {
            sendmsg(custmsg);
        }
        custmsg = "";
    }
}

function setTYP() {
    settyptime = getTime();
    $(".kf_input").addClass("is_inputting");
}

function setupTypingProc(mode) {
    if (mode == CONST_TYPE_MODE_WITHOUT_MSG) {
        typtime = 8;
    } else {
        typtime = 4;
    }
    sendtyp_type = mode;
}

function sendTypMsg() {
    if (getTime() - settyptime >= 8) {
        clearTYP();
    }
    sendTYP();
}

function clearTYP() {
    settyptime = getTime();
    $(".kf_input").removeClass("is_inputting");
}

function sendTYP() {
    var msg_content = $.trim(kindeditor.html());
    msg_content = msg_content.replace(/&nbsp;/g, '').replace(/ /g, '');
    msg_content = HtmlDecode(msg_content);
    if (getTime() - sendtyptime >= typtime && typcontent != msg_content) {
        if (sendtyp_type == 0) {
            if (msg_content != "") {
                g_comm.SendTyping("");
            }
        } else {
            if (msg_content != "") {
                var msg = UBBEncode(msg_content);
                try {
                    msg = msgFilter(msg);
                } catch (e) {
                }
                g_comm.SendTyping(UBBCode(UrlEncode(msg)));
            } else {
                if (typcontent != '') {
                    g_comm.SendTyping('');
                }
            }
        }
        sendtyptime = getTime();
        typcontent = msg_content;
    }
}

function checkKfNoTalk() {
    if (kfNoTalkNum < CONST_KF_NOTALK_TIP) {
        kfNoTalkNum++;
    } else {
        setKfNoTalkVariable();
        if (lnkover == 1) {
            display_kf_msg(UBBCode(UBBEncode(getKfPrompt('busy_prompt'))));
            qstmsg(UrlEncode(UBBEncode(getKfPrompt('busy_prompt'))), undefined, 'b');
        }
    }
}

function setNoTalkVariable() {
    noTalkNum = 0;
    noTalkOver = 0;
}

function setKfNoTalkVariable() {
    kfNoTalkNum = 0;
    clearInterval(m_kfNoTalkTimer);
}

function setImKfNoTalkVariable() {
    ImKfNoTalkNum = 0;
}

function checkImKfNoTalk() {
    if (ImKfNoTalkNum < imkf_no_talk_time) {
        ImKfNoTalkNum++;
    } else {
        if (lnkover == 1) closeLink();
    }
}

function checkNoTalk() {
    if (noTalkNum < CONST_NOTALK_TIP) {
        noTalkNum++;
    } else {
        if (noTalkOver == 0) {
            display_sys_msg(disconnect_prompt);
        }
        if (noTalkOver < CONST_NOTALK_OVER) {
            noTalkOver++;
        } else {
            closeLink();
        }
    }
}

function closeLink() {
    closemark = "zhudong";
    g_comm.TerminateLink();
}

function qstmsg(msg, fk_msgid, msg_type, msgid) {
    typcontent = '';
    if (msg_type == 'a') {
        setKfNoTalkVariable();
        setImKfNoTalkVariable();
    } else if (msg_type != 'b') {
        setNoTalkVariable();
    }
    try {
        clearTimeout(carousel_id);
    } catch (e) {
    }
    if (kfNoTalkNum == 0 && msg_type != 'b' && msg_type != 'a') {
        try {
            clearInterval(m_kfNoTalkTimer);
            m_kfNoTalkTimer = setInterval("checkKfNoTalk()", 1000);
        } catch (e) {
        }
    }
    var code_arr = new Array();
    if (msg_type != 'b' && msg_type != 'a') {
        try {
            var mo_patt = new RegExp("(%5BMOBILE%5D)(\\d+?)(%5B%2FMOBILE%5D)", "gim");
            var ph_patt = new RegExp("(%5BPHONE%5D)([\\d\\-]+?)(%5B%2FPHONE%5D)", "gim");
            var em_patt = new RegExp("(%5BEMAIL%5D)(\\S+?)(%5B%2FEMAIL%5D)", "gim");
            var img_patt = new RegExp("(%5BIMG%5D)(\\S+?)(%5B%2FIMG%5D)", "gim");
            var url_patt = new RegExp("(%5BURL%3D(.+?)%5D)(.+?)(%5B%2FURL%5D)", "gim");
            var qq_patt = new RegExp("[1-9][0-9]{5,10}", "gim");
            if (mo_patt.test(msg)) {
                code_arr.push("1");
            }
            if (ph_patt.test(msg)) {
                code_arr.push("2");
            }
            if (em_patt.test(msg)) {
                code_arr.push("3");
            }
            var msg_tmp = decodeURIComponent(msg.replace(mo_patt, '').replace(ph_patt, '').replace(em_patt, '').replace(img_patt, '').replace(url_patt, ''));
            if (checkWechatByMsg(msg_tmp, 'v')) {
                code_arr.push("5");
            } else {
                if (qq_patt.test(msg_tmp)) {
                    code_arr.push("4");
                }
            }
        } catch (e) {
        }
    }
    g_comm.SendTalkMsg(msg, code_arr.join(","), fk_msgid, msg_type, msgid);
}

function qstRobotMsg(msg, type, task_zsk_id, index, times, guide_size, hasWechat) {
    var code_arr = new Array();
    if (type == "g") {
        msg = msgFilter(msg);
        msg = UBBEncode(msg);
        msg = UrlEncode(msg);
        msg = HtmlEncode(msg);
        try {
            if (type !== true) {
                var mo_patt = new RegExp("(%5BMOBILE%5D)(\\d+?)(%5B%2FMOBILE%5D)", "gim");
                var ph_patt = new RegExp("(%5BPHONE%5D)([\\d\\-]+?)(%5B%2FPHONE%5D)", "gim");
                var em_patt = new RegExp("(%5BEMAIL%5D)(\\S+?)(%5B%2FEMAIL%5D)", "gim");
                var img_patt = new RegExp("(%5BIMG%5D)(\\S+?)(%5B%2FIMG%5D)", "gim");
                var url_patt = new RegExp("(%5BURL%3D(.+?)%5D)(.+?)(%5B%2FURL%5D)", "gim");
                var qq_patt = new RegExp("[1-9][0-9]{5,10}", "gim");
                if (mo_patt.test(msg)) {
                    code_arr.push("1");
                }
                if (ph_patt.test(msg)) {
                    code_arr.push("2");
                }
                if (em_patt.test(msg)) {
                    code_arr.push("3");
                }
                var msg_tmp = decodeURIComponent(msg.replace(mo_patt, '').replace(ph_patt, '').replace(em_patt, '').replace(img_patt, '').replace(url_patt, ''));
                if (qq_patt.test(msg_tmp)) {
                    code_arr.push("4");
                }
                if (hasWechat == 1) {
                    code_arr.push("5");
                }
            }
        } catch (e) {
        }
    } else if (type == "p") {
        msg = HtmlDecode(msg);
    }
    if (task_zsk_id != undefined && index != undefined && times != undefined && guide_size != undefined) {
        robot_client.sendRoa(msg, type, code_arr.join(","), task_zsk_id, index, times, guide_size);
    } else {
        robot_client.sendRoa(msg, type, code_arr.join(","));
    }
}

function getClueByMsg(msg, type) {
    msg = msg.replace(/<[^>]+>/g, "");
    if (type == "w") {
        if (msg.toLowerCase().indexOf('qq') > -1) {
            custom_auto_update.qq = 2;
        }
        if (msg.toLowerCase().indexOf('微信') > -1) {
            custom_auto_update.wechat = 2;
        }
    } else if (type == "v") {
        var data_new = {"mobile": "", "phone": "", "email": "", "qq": "", "wechat": "",};
        var msg = msg.replace(/\[URL=.*?]/g, '').replace(/\[IMG\](.*?)\[\/IMG\]/g, '');
        data_new.mobile = msgInfoFilter(msg, 'mobile');
        data_new.phone = msgInfoFilter(msg, 'phone');
        data_new.email = msgInfoFilter(msg, 'email');
        if (msg.toLowerCase().indexOf('qq') > -1 || custom_auto_update.qq > 0) {
            if (msg.toLowerCase().indexOf('qq') > -1) {
                custom_auto_update.qq = 2;
            }
            data_new.qq = msgInfoFilter(msg, 'qq');
            custom_auto_update.qq--;
        }
        if (msg.toLowerCase().indexOf('微信') > -1 || custom_auto_update.wechat > 0) {
            if (msg.toLowerCase().indexOf('微信') > -1) {
                custom_auto_update.wechat = 2;
            }
            data_new.wechat = msgInfoFilter(msg, 'wechat');
            custom_auto_update.wechat--;
        }
        if (data_new.mobile != "" || data_new.phone != "" || data_new.email != "" || data_new.qq != "" || data_new.wechat != "") saveRobotClue(data_new);
        return data_new;
    }
}

function checkWechatByMsg(msg, type) {
    msg = msg.replace(/<[^>]+>/g, "");
    if (type == "w") {
        if (msg.toLowerCase().indexOf('微信') > -1) {
            custom_wechat_update = 2;
        }
    } else if (type == "v") {
        var wechat = '';
        var msg = msg.replace(/\[URL=.*?]/g, '').replace(/\[IMG\](.*?)\[\/IMG\]/g, '');
        if (msg.toLowerCase().indexOf('微信') > -1 || custom_wechat_update > 0) {
            if (msg.toLowerCase().indexOf('微信') > -1) {
                custom_wechat_update = 2;
            }
            wechat = msgInfoFilter(msg, 'wechat');
            custom_wechat_update--;
        }
        if (wechat == '') return false;
        return true;
    }
}

function msgInfoFilter(msg, filter_key) {
    if (filter_key == 'mobile') {
        var data = ('-' + msg).match(/[^\d](1[3-9]\d{9})(?!\d)/);
        if (data) data = data[0].substring(1);
    }
    if (filter_key == 'phone') {
        var data = ('-' + msg).match(/[^\d](0\d{2,3}-?\d{7,8})(?!\d)/);
        if (data) data = data[0].substring(1);
    }
    if (filter_key == 'email') {
        var data = msg.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
        if (data) data = data[0];
    }
    if (filter_key == 'qq') {
        var data = ('-' + msg).match(/[^\d](\d{5,12})(?!\d)/);
        if (data) data = data[0].substring(1);
    }
    if (filter_key == 'wechat') {
        var data = ('-' + msg).match(/[^\w]\w{6,20}(?![\w#])/);
        if (data) data = data[0].substring(1);
    }
    if (data != "" && data != null) return data; else return "";
}

function saveRobotClue(data) {
    var url = "/client/set_robot_msg.php";
    var postdata = "mobile=" + data.mobile + "&phone=" + data.phone + "&email=" + data.email + "&qq=" + data.qq + "&weixin=" + data.wechat + "&company_id=" + company_id + "&guest_id=" + myid + "&talk_id=" + myfirst_tempid + "&land_page=" + UrlEncode(landpage) + "&referer=" + UrlEncode(talkpage) + "&referer1=" + UrlEncode(frompage) + "&ucust_id=" + ucust_id + "&u_stat_id=" + u_stat_id + "&tfrom=" + tfrom + "&style_id=" + style_id + "&uid=" + uid + "&open_time=" + open_time + "&channel=" + UrlEncode(channel) + "&se=" + UrlEncode(search_engine) + "&kw=" + UrlEncode(keyword);
    $.ajax({
        type: 'POST', url: url, data: postdata, success: function (data) {
        }
    })
}

function getRobotTips() {
    var now = new Date();
    if (now.getTime() < robotTipsTime) return;
    robotTipsTime = now.getTime() + 1000;
    var word = $.trim(kindeditor.html());
    if (word == '') {
        hideRobotTips();
        return;
    }
    $.ajax({
        url: "/client/clientRobot.php",
        data: {
            cmd: "ACQ",
            com_id: company_id,
            robot_id: m_robid,
            word: word,
            "guest_id": myid,
            "api_robot_id": zsk_api_robot_id,
            "api_name": zsk_api_name
        },
        success: function (result) {
            var result = eval("(" + result + ")");
            if (result.total > 0) showRobotTips(result);
        }
    });
}

function getRobotReply(question) {
    showRobotLoad();
    $.ajax({
        url: "/client/clientRobot.php",
        dataType: "json",
        data: {
            cmd: "UQR",
            com_id: company_id,
            robot_id: m_robid,
            question: question,
            "guest_id": myid,
            "api_robot_id": zsk_api_robot_id,
            "api_name": zsk_api_name
        },
        success: function (result) {
            task_robot_obj.backRobotGuide();
            var q_id = '0';
            var answer = UBBCode(UBBEncode(zsk_un_prompt));
            var type = 'unanswer';
            if (result != null && result["q_id"] != "0") {
                answer = result["answer"];
                q_id = result["q_id"];
                type = 'answer';
                if (zsk_api_name == 'yw') {
                    if (result['serviceType'] == 'seat') type = 'toTalk';
                }
                if (zsk_api_name == 'ly') {
                    if (result['answer'] == 'order_transfer') type = 'toTalk';
                }
            }
            dealRobotQa(q_id, question, answer, type);
        },
        error: function () {
            dealRobotQa('0', question, UBBCode(UBBEncode(zsk_un_prompt)), 'unanswer');
        }
    });
}

function dealRobotQa(q_id, question, answer, type) {
    if (zsk_api_name == 'ly' && q_id == "" && answer == "") {
        getRobotReply(question);
        return;
    }
    hideRobotTips();
    if (zsk_api_name != 'yw') customerResponse(q_id, 5);
    kindeditor.html("");
    if (type == "hot" && lnkover == 4) {
        if (zsk_kw_trans.length > 0 && task_robot_use == '0') {
            for (var i = 0; i < zsk_kw_trans.length; i++) {
                if (zsk_kw_trans[i].match_type == '0') {
                    if (question == zsk_kw_trans[i].key_word) {
                        display_fk_msg(question);
                        offToTalk('robot');
                        return;
                    }
                } else {
                    if (question.indexOf(zsk_kw_trans[i].key_word) != -1) {
                        display_fk_msg(question);
                        offToTalk('robot');
                        return;
                    }
                }
            }
        }
    }
    display_fk_msg(question);
    robot_unshow_msg++;
    var clueData = getClueByMsg(question, "v");
    if (type == 'answer') getClueByMsg(answer, "w");
    var hasWechat = clueData.wechat == '' ? 0 : 1;
    qstRobotMsg(question, "g", undefined, undefined, undefined, undefined, hasWechat);
    if (type == 'toTalk') {
        offToTalk('robot');
        return;
    }
    if (task_robot_use != "0" && (q_id == '0' || q_id == '' || q_id == undefined || q_id == null)) {
        robot_unshow_msg--;
        if (robot_unshow_msg == 0) removeRobotLoad();
        task_robot_obj.handleMsg(question);
        return;
    }
    var rela_ques = '';
    $.ajax({
        url: "/client/clientRobot.php",
        data: {
            cmd: "GT",
            com_id: company_id,
            q_id: q_id,
            "guest_id": myid,
            "question": question,
            "api_robot_id": zsk_api_robot_id,
            "api_name": zsk_api_name
        },
        dataType: "json",
        async: false,
        success: function (data) {
            rela_ques = data;
        }
    });
    answer = robotMsgReplace(answer);
    display_robot_answer(q_id, answer, rela_ques);
    robot_unshow_msg--;
    if (robot_unshow_msg == 0) removeRobotLoad();
    qstRobotMsg(answer, "p");
    task_robot_obj.showLastMsg();
    if (type == 'unanswer') {
        if (zsk_zdzrg == '1') {
            robot_cannot_answer_times += 1;
            if (robot_cannot_answer_times == zsk_unret_times) {
                offToTalk('robot');
                robot_cannot_answer_times = 0;
            }
        } else {
            display_sys_msg('', 'cannot_answer');
        }
    }
}

function customerResponse(q_id, val) {
    if (q_id != "0") {
        $.ajax({
            url: "/client/clientRobot.php",
            data: {
                cmd: "CR",
                com_id: company_id,
                robot_id: m_robid,
                q_id: q_id,
                val: val,
                "guest_id": myid,
                "api_robot_id": zsk_api_robot_id,
                "api_name": zsk_api_name
            },
            success: function (result) {
            }
        });
    }
}

function offToTalk(type) {
    display_sys_msg('', 'wait');
    var data = {
        'company_id': company_id,
        'style_id': style_id,
        'guest_id': myid,
        'from_page': frompage,
        'land_page': landpage,
        'guest_ip_info': guest_ip_info
    };
    $.ajax({
        type: "POST", url: "/impl/get_new_talk.php", data: data, dataType: "json", success: function (data) {
            if (data.is_online == 1) {
                hasOnlineKf = '1';
                worker_ids = data.kf_list;
                lnk_overflow = data.lnk_overflow;
                firewall_uuid = data.firewall_uuid;
                lnk_param = data.lnk_param;
                lnk_fire = data.lnk_fire;
                kflist = 'off';
                lnkopentime = Date.parse(new Date()) / 1000;
                if (type == 'robot') {
                    is_robotToTalk = true;
                } else if (type == 'scene') {
                    is_sceneToTalk = true;
                }
                isSendLNK = false;
                sendLNK();
            } else {
                showNoKfToTalk(type);
            }
        }, error: function (data) {
            showNoKfToTalk(type);
        }
    });
}

function robotToTalk() {
    offToTalk('robot');
}

function formSend(id, num, obj) {
    if (formSendClick) return;
    $(".pc_talk_content").find(".error_import").removeClass('error_import');
    var $parent = $(obj).parents(".guide_form");
    var qqreg = new RegExp(/^[1-9][0-9]{4,10}$/);
    var wxreg = new RegExp(/^[-_a-zA-Z0-9]{6,20}$/);
    var phonereg = new RegExp(/^[1][3|4|5|6|7|8|9][0-9]{9}$/);
    var emailreg = new RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
    var verreg = new RegExp(/^[0-9]{6}$/);
    var nameval = '';
    var phoneval = '';
    var wxval = '';
    var qqval = '';
    var addval = '';
    var emailval = '';
    var verval = '';
    var content = '';
    var vercode = 0;
    if ($parent.find(".input_name").length > 0) {
        nameval = $.trim($parent.find(".input_name").val());
        if (nameval == "") {
            $parent.find(".input_name").addClass('error_import');
            return false;
        }
        content += '姓名:&nbsp;' + nameval + '<br/>';
    }
    if ($parent.find(".input_phone").length > 0) {
        phoneval = $.trim($parent.find(".input_phone").val());
        if (phoneval == "" || !phonereg.test(phoneval)) {
            $parent.find(".input_phone").addClass('error_import');
            return false;
        }
        content += '手机:&nbsp;' + phoneval + '<br/>';
    }
    if ($parent.find(".phone_ver_code").length > 0 && $parent.find(".phone_ver_code").is(':visible')) {
        vercode = 1;
        if ($parent.find(".input_vercode").length < 1) {
            basic.toastOut(langs[88]);
            return false;
        } else {
            verval = $.trim($parent.find(".input_vercode").val());
            if (verval == "" || !verreg.test(verval)) {
                $parent.find(".input_vercode").addClass('error_import');
                return false;
            }
        }
    }
    if ($parent.find(".input_wechat").length > 0) {
        wxval = $.trim($parent.find(".input_wechat").val());
        if (wxval == "" || !wxreg.test(wxval)) {
            $parent.find(".input_wechat").addClass('error_import');
            return false;
        }
        content += '微信:&nbsp;' + wxval + '<br/>';
    }
    if ($parent.find(".input_qq").length > 0) {
        qqval = $.trim($parent.find(".input_qq").val());
        if (qqval == "" || !qqreg.test(qqval)) {
            $parent.find(".input_qq").addClass('error_import');
            return false;
        }
        content += 'QQ:&nbsp;' + qqval + '<br/>';
    }
    if ($parent.find(".input_address").length > 0) {
        addval = $.trim($parent.find(".input_address").val());
        if (addval == "") {
            $parent.find(".input_address").addClass('error_import');
            return false;
        }
        content += '地址:&nbsp;' + addval + '<br/>';
    }
    if ($parent.find(".input_email").length > 0) {
        emailval = $.trim($parent.find(".input_email").val());
        if (emailval == "" || !emailreg.test(emailval)) {
            $parent.find(".input_email").addClass('error_import');
            return false;
        }
        content += '邮箱:&nbsp;' + emailval + '<br/>';
    }
    if (content == '') return;
    var sendData = "company_id=" + company_id + "&guest_id=" + myid + "&style_id=" + style_id + "&name=" + nameval + "&email=" + emailval + "&mobile=" + phoneval + "&qq=" + qqval + "&weixin=" + wxval + "&addr=" + addval + "&device=1&action=save&vercode=" + vercode;
    if (verval != '') sendData += "&code=" + verval;
    formSendClick = true;
    $(obj).html('<span class="preview_loding"></span>');
    $.ajax({
        type: 'POST', url: 'client/scene_form.php', data: sendData, dataType: 'json', success: function (data) {
            $(obj).html("<%$lang_htm[16]%>");
            formSendClick = false;
            if (data.code == 0) {
                sendFormMsg(obj, id, num, content);
            } else if (data.code == 2) {
                $parent.find(".input_vercode").addClass('error_import');
            } else if (data.code == 3) {
                basic.toastOut(langs[88]);
            } else {
                basic.toastOut(langs[31]);
            }
        }, error: function () {
            formSendClick = false;
            $(obj).html(langs[89]);
            basic.toastOut(langs[31]);
        }
    })
}

function sendFormMsg(obj, id, num, content) {
    var step = id + '-' + num;
    var msg = UrlEncode(UBBEncode(content));
    var code_arr = new Array();
    try {
        var mo_patt = new RegExp("(%5BMOBILE%5D)(\\d+?)(%5B%2FMOBILE%5D)", "gim");
        var ph_patt = new RegExp("(%5BPHONE%5D)([\\d\\-]+?)(%5B%2FPHONE%5D)", "gim");
        var em_patt = new RegExp("(%5BEMAIL%5D)(\\S+?)(%5B%2FEMAIL%5D)", "gim");
        var img_patt = new RegExp("(%5BIMG%5D)(\\S+?)(%5B%2FIMG%5D)", "gim");
        var url_patt = new RegExp("(%5BURL%3D(.+?)%5D)(.+?)(%5B%2FURL%5D)", "gim");
        var qq_patt = new RegExp("[1-9][0-9]{5,10}", "gim");
        if (mo_patt.test(msg)) {
            code_arr.push("1");
        }
        if (ph_patt.test(msg)) {
            code_arr.push("2");
        }
        if (em_patt.test(msg)) {
            code_arr.push("3");
        }
        var msg_tmp = decodeURIComponent(msg.replace(mo_patt, '').replace(ph_patt, '').replace(em_patt, '').replace(img_patt, '').replace(url_patt, ''));
        if (qq_patt.test(msg_tmp)) {
            code_arr.push("4");
        }
    } catch (e) {
    }
    scene_client.sendRoa(msg, step, 'f', undefined, undefined, code_arr.join(","));
    $(obj).parents(".reception_talk_info").removeClass("guide_f").html(langs[86]);
    showSceneGuide(id, num + 1);
}

function sendSceneFormCode(mobile) {
    $.ajax({
        type: 'POST',
        url: 'client/scene_form.php',
        data: "action=send&company_id=" + company_id + "&guest_id=" + myid + "&mobile=" + mobile,
        dataType: 'json',
        success: function (data) {
        },
        error: function () {
        }
    });
}

function chooseCard(point, step, obj) {
    $(obj).parent().hide();
    var msg = $(obj).html();
    display_fk_msg(msg);
    scene_client.sendRoa(UrlEncode(UBBEncode(msg)), step, 'g', point);
    showSceneGuide(point);
}

function submitVisitorForm(obj) {
    if ($(obj).hasClass('submiting')) return;
    var parent = $(obj).parent('.phone_visitor_form');
    var visitor_form_items = parent.find('.visitor_form_ques');
    var html = '';
    var name = '', mobile = '', email = '', qq = '', weixin = '';
    for (var i = 0; i < visitor_form_items.length; i++) {
        var item = visitor_form_items.eq(i);
        var value = (item.find('input').length > 0 ? item.find('input').val() : item.find('select').val());
        value = value.trim();
        if (item.hasClass('nomal')) {
            if (visitor_form_check(item.find('input').attr('data-type'), value) == true) {
                item.find('input').addClass('error_import');
                item.find('.tip_error').show();
                return false;
            }
        } else {
            if (item.find('input').length > 0) {
                if (value == '') {
                    item.find('input').addClass('error_import');
                    item.find('.tip_error').show();
                    return false;
                }
            } else {
                if (value == '' || value == item.find('option').eq(0).text()) {
                    item.find('select').addClass('error_import');
                    item.find('.tip_error').show();
                    return false;
                }
            }
        }
        var key_name = visitor_form[item.attr('data-id')]['name'];
        var field_name = visitor_form[item.attr('data-id')]['field_name'];
        if (field_name == 'name') {
            name = value;
        } else if (field_name == 'mobile') {
            mobile = value;
        } else if (field_name == 'weixin') {
            weixin = value;
        } else if (field_name == 'qq') {
            qq = value;
        } else if (field_name == 'email') {
            email = value;
        }
        html += key_name + '：' + value;
        if (i < visitor_form_items.length - 1) {
            html += '<br/>';
        }
    }
    $(obj).addClass('submiting').text(langs[85]);
    if (name == '' && mobile == '' && weixin == '' && qq == '' && email == '') {
        sendQaMsg(html, 'z', parent.attr('id'));
    } else {
        sendVistorForm(name, mobile, email, qq, weixin, html, parent.attr('id'));
    }
}

function sendVistorForm(name, mobile, email, qq, weixin, html, formid) {
    var sendData = "company_id=" + company_id + "&guest_id=" + myid + "&name=" + name + "&email=" + email + "&mobile=" + mobile + "&qq=" + qq + "&weixin=" + weixin + "&device=1&action=save&vercode=0&id6d=" + obj_id;
    $.ajax({
        type: 'POST', url: 'client/scene_form.php', data: sendData, dataType: 'json', success: function (data) {
            if (data.code == '0') {
                sendQaMsg(html, 'z', formid);
            } else {
                $('#' + formid).find('.visitor_form_submit').text(langs[81]).removeClass('submiting');
                basic.toastOut(langs[31]);
            }
        }, error: function () {
            $('#' + formid).find('.visitor_form_submit').text(langs[81]).removeClass('submiting');
            basic.toastOut(langs[31]);
        }
    });
}

function sendReg(obj) {
    if ($(obj).hasClass("prevent-btn")) return false;
    var zdyzc_obj = {};
    var reg_data = {'name': '', 'email': '', 'mobile': '', 'qq': '', 'weixin': '', 'company': '', 'addr': ''};
    for (var key = 0; key < fkzc_fields.length; key++) {
        var reg_field = fkzc_fields[key].field_name;
        var reg_value = $.trim($("#reg_" + fkzc_fields[key].field_name).val());
        var reg_ismust = fkzc_fields[key].isMust;
        var reg_iszdy = fkzc_fields[key].isZdy;
        if (!check_input('reg', reg_field, reg_ismust)) return;
        if (reg_iszdy == 1) {
            zdyzc_obj[fkzc_fields[key].name] = reg_value;
        } else {
            reg_data[reg_field] = UrlEncode(reg_value);
        }
    }
    $(obj).text("").addClass("loading");
    try {
        zdyzc_obj = JSON.stringify(zdyzc_obj);
    } catch (e) {
        zdyzc_obj = '';
    }
    var zdyzc_str = UrlEncode(zdyzc_obj);
    var senddata = "action=import&name=" + reg_data.name + "&email=" + reg_data.email + "&mobile=" + reg_data.mobile + "&qq=" + reg_data.qq + "&weixin=" + reg_data.weixin + "&company=" + reg_data.company + "&addr=" + reg_data.addr + "&company_id=" + company_id + "&guest_id=" + guest_id + "&id6d=" + adminId6d + "&arg=" + arg + '&guest_uid=' + ucust_id + '&zdyzc_str=' + zdyzc_str + '&talk_page=' + talkpage + '&tfrom=' + tfrom + '&device=1';
    $.ajax({
        type: "GET", url: "impl/guest_info.php?" + senddata, success: function (msg) {
            setOnLine(false);
            is_reg = '1';
        }, error: function (e) {
            basic.toastOut(langs[31]);
            $("#to_link").text(langs[4]).removeClass("loading");
        }
    });
}

function submit_lword(vcode) {
    if ($("#submit_lword").hasClass("prevent-btn")) return false;
    if (lyClick) return false;
    var fielddata = '';
    var zdyzc_obj = {};
    for (var key = 0; key < fkly_fields.length; key++) {
        var ly_field = fkly_fields[key].field_name;
        var ly_value = $.trim($("#ly_" + fkly_fields[key].field_name).val());
        var ly_ismust = fkly_fields[key].isMust;
        var ly_iszdy = fkly_fields[key].isZdy;
        if (!check_input('ly', ly_field, ly_ismust)) return;
        if (ly_iszdy == 1) {
            zdyzc_obj[fkly_fields[key].name] = ly_value;
        } else {
            if (ly_field == 'mobile') ly_field = 'phone';
            if (ly_field == 'weixin') ly_field = 'wechat';
            fielddata += "&ly_" + ly_field + "=" + UrlEncode(ly_value);
        }
    }
    if (ly_captcha != '2' && vcode == undefined) {
        m_checkCodeType = 2;
        createCodeFreeze(myid, 1, company_id);
        return;
    }
    lyClick = true;
    $("#submit_lword").text(" ").addClass("loading");
    var ly_content = $.trim($("#ly_content").val());
    try {
        zdyzc_obj = JSON.stringify(zdyzc_obj);
    } catch (e) {
        zdyzc_obj = '';
    }
    fielddata += "&ly_content=" + UrlEncode(ly_content) + "&zdyzc_str=" + UrlEncode(zdyzc_obj);
    var url = "lword.php";
    var senddata = "action=import&ly_first=true&company_id=" + company_id + "&tempid=" + mytempid + "&guest_id=" + myid + "&land_page=" + UrlEncode(landpage) + "&referer=" + UrlEncode(talkpage) + "&referer1=" + UrlEncode(frompage) + "&ly_mode=3&ly_object=" + m_lwordObject + "&ucust_id=" + ucust_id + "&u_stat_id=" + u_stat_id + "&uid=" + uid + "&tfrom=" + tfrom + "&style_id=" + style_id + "&style=" + style + "&vcode=" + vcode + "&channel=" + UrlEncode(channel) + fielddata;
    $.ajax({
        type: 'POST', url: url, data: senddata, success: function (data) {
            var ret = strToObj(data);
            if (parseInt(ret.guestid) > 0) {
                myid = ret.guestid;
                setCookie("guest_id", myid);
            }
        }, error: function () {
            try {
                clearTimeout(lwordSuccess);
            } catch (e) {
            }
            basic.toastOut(langs[31]);
            $("#submit_lword").text(langs[6]).removeClass("loading");
            lyClick = false;
            clearTimeout();
        }
    });
    lwordSuccessTimer = setTimeout(function () {
        lwordSuccess();
    }, 2000);
}

function lwordSuccess() {
    $(".leaveMsg-suc").show().siblings().hide();
    var sec = parseInt($(".leaveMsg-suc").find(".seconds").text());
    var _this = $(".leaveMsg-suc");
    close_ly_window_timer = setInterval(function () {
        sec--;
        _this.find(".seconds").text(sec);
        if (sec <= 0) {
            close_ly_window();
        }
    }, 1000);
    lyClick = false;
    if (origin_type == '1') {
        sendkafka('type', '1', '-1', origin_time);
        origin_type = 0;
    }
    if (talk_type != '1') {
        talk_type = 1;
        sendkafka('type', '1', '1');
    }
}

function checkPhoneOnTalk(msg) {
    var send_qst = true;
    var mobi_reg = new RegExp("(\\[MOBILE\])(\\d+?)(\\[\\/MOBILE\\])", "im");
    var mobile = msg.match(mobi_reg);
    if (mobile) {
        mobile = mobile[2];
        sendCheckPhone(mobile, 'send');
        return send_qst;
    }
    var code = '';
    var code_reg = new RegExp("[\\d]+([\\d]{6})(?!\\d)", "gim");
    if (!code_reg.test(msg)) {
        code_reg = new RegExp("[^\\d]?([\\d]{6})(?!\\d)", "im");
        code = msg.match(code_reg);
    }
    if (code) {
        code = code[1];
        for (var i = 0; i < checkPhoneArr.length; i++) {
            if (checkPhoneArr[i].sendtimes < 4 && checkPhoneArr[i].is_check == false) {
                checkPhoneArr[i].sendtimes++;
                sendCheckPhone(checkPhoneArr[i].mobile, 'check', code);
                send_qst = false;
            }
        }
    }
    return send_qst;
}

function sendCheckPhone(mobile, action, code) {
    var postData = {'company_id': company_id, 'style_id': style_id, 'action': action, 'mobile': mobile};
    if (action == 'check') {
        postData.code = code;
        postData.first_tempid = myfirst_tempid;
        postData.guest_id = myid;
        postData.id6d = obj_id;
    }
    $.ajax({
        type: 'post', url: 'client/checkPhoneOnTalk.php', data: postData, dataType: 'json', success: function (data) {
            if (data.code == 0) {
                if (action == 'send') {
                    display_sys_msg(langs[92]);
                    var has = false;
                    for (var i = 0; i < checkPhoneArr.length; i++) {
                        if (checkPhoneArr[i].mobile == mobile) {
                            checkPhoneArr[i].sendtimes = 0;
                            has = true;
                        }
                    }
                    if (!has) {
                        var checkPhoneTemp = {'mobile': mobile, 'sendtimes': 0, 'is_check': false};
                        checkPhoneArr.push(checkPhoneTemp);
                    }
                } else {
                    for (var i = 0; i < checkPhoneArr.length; i++) {
                        if (checkPhoneArr[i].mobile == mobile) {
                            checkPhoneArr[i].is_check = true;
                        }
                    }
                }
            }
        }
    });
}

function sendCinfo() {
    if (comeinfo.logo != "" && comeinfo.title != "" && comeinfo.content != "" && comeinfo.curl != "") {
        try {
            clearTimeout(carousel_id);
        } catch (e) {
        }
        g_comm.SendCinfoMsg(encodeURIComponent(comeinfo.logo), encodeURIComponent(comeinfo.title), encodeURIComponent(comeinfo.content), encodeURIComponent(comeinfo.curl));
        display_fk_msg(getCinfoHtml(comeinfo.logo, comeinfo.title, comeinfo.content, comeinfo.curl));
    }
}

function save_vote() {
    if (vote_true) {
        display_sys_msg(langs[53]);
        return;
    }
    vote_true = true;
    if (myfirst_tempid == '') myfirst_tempid = mytempid;
    var url = "vote.php?client=pc";
    var vote_value = getVoteValue();
    var senddata = "company_id=" + company_id + "&id6d=" + obj_id + "&action=vote&vote=" + vote_value + "&temp_id=" + myfirst_tempid + "&guest_id=" + myid + "&device=1";
    $.post(url, senddata, function (data) {
        if (data.ecode == 0) {
            hiddenVoteIcon();
            display_sys_msg(langs[18]);
            replayVote("1");
        }
    }, 'json').error(function () {
        vote_true = false;
        display_sys_msg(langs[54]);
    });
}

function saveas() {
    if (lnkover == 1 || lnkover == 2 || lnkover == 4) {
        if (myfirst_tempid == '') myfirst_tempid = mytempid;
        try {
            var time = new Date();
            var filename = time.toLocaleDateString();
            filename = filename + " " + cname + ".htm";
            if (browserType == 'IE') {
                var a = document.createElement("a");
                a.href = http_pro + host + '/impl/rpc_download_html.php?company_id=' + company_id + '&tempid=' + myfirst_tempid + '&style_id=' + style_id + '&company_tpl=' + company_tpl + '&lang=' + language + '&saverec_code=' + saverec_code + '&filename=' + UrlEncode(filename) + '&gid=' + myid;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                var winSave = window.open(http_pro + host + '/impl/rpc_download_html.php?company_id=' + company_id + '&tempid=' + myfirst_tempid + '&style_id=' + style_id + '&company_tpl=' + company_tpl + '&lang=' + language + '&saverec_code=' + saverec_code + '&filename=' + UrlEncode(filename) + '&gid=' + myid, '_blank', 'top=10000');
            }
        } catch (e) {
        }
    }
}

function getCusWebMsg() {
    $.ajax({
        type: 'POST',
        url: 'impl/rpc_cus_web_msg.php',
        data: "type=mobile&check_id=11917718fe939f3106d35a30074bcd30&company_id=" + company_id + "&guest_id=" + myid,
        dataType: "JSON",
        success: function (data) {
            if (data.code == "200" && data.msg.length > 0) {
                showCusWebMsgList(data.msg);
            }
        }
    })
}

function showCusWebMsgList(msgList) {
    for (var i = 0; i < msgList.length; i++) {
        var msg = msgList[i].remark;
        if (!isLoadVoice(msg)) {
            setTimeout(function () {
                showCusWebMsgList(msgList);
            }, 100);
            return;
        }
    }
    for (var i = 0; i < msgList.length; i++) {
        var msg = msgList[i];
        var send_time = msg.send_time;
        var bname = msg.bname;
        var remark = HtmlDecode(msg.remark);
        var web_talk_id = msg.talk_id;
        if (web_msg_talk_id.indexOf(web_talk_id) == -1) {
            web_msg_talk_id.push(web_talk_id);
        }
        display_kf_msg(UBBCode(remark), bname, undefined, send_time, 'offline');
    }
}

function get_record() {
    $(".show_history").removeClass("show_history_hover");
    $("#show_last_msg_button").addClass("disabled");
    try {
        last_talk_id = last_talk_id ? last_talk_id : myfirst_tempid;
        var data = {"company_id": company_id, "guest_id": myid, "talk_id": last_talk_id, "style_id": style_id};
        $.ajax({
            type: "POST",
            url: "/impl/last_msg_info.php",
            data: data,
            timeout: 30000,
            dataType: "JSON",
            success: function (res) {
                if (res.code == "error") {
                    basic.toastOut(res.info);
                } else {
                    var info = res.info;
                    if (info == "") {
                        $("#show_last_msg_button").html(langs[65]);
                    } else {
                        $("#show_last_msg_button").html(langs[70]);
                        last_talk_id = info[0].talk_id;
                        setLastMsg(info);
                        $(".phone_ver_code").html(langs[87]);
                        time_flag = false;
                    }
                }
            },
            error: function (xhr, status, error) {
                $("#show_last_msg_button").html(langs[66]);
            }
        });
    } catch (e) {
    }
}

function setLastMsg(info) {
    for (var i = 0; i < info.length; i++) {
        var msg = info[i].msg;
        if (i == 0) msg = UBBEncode(msg);
        if (!isLoadVoice(msg)) {
            setTimeout(function () {
                setLastMsg(info);
            }, 100);
            return;
        }
    }
    var is_show_web_msg = false;
    if (web_msg_talk_id.indexOf(last_talk_id) == -1) is_show_web_msg = true;
    for (var i = 0; i < info.length; i++) {
        var msg = info[i].msg;
        msg = HtmlDecode(msg);
        if (i == 0) msg = UBBEncode(msg);
        var msg_time = info[i].msg_time;
        var id6d = info[i].id6d;
        var talkname = obj_name;
        if (id6d != obj_id) {
            talkname = getWorkerNameById6d(id6d);
        }
        var type = info[i].type;
        if (type == 'f') {
            display_kf_msg(langs[86], talkname, undefined, msg_time, undefined, 'last');
            return;
        }
        var imageText = new RegExp("(\\[imageText\])([\\s\\S]+?)(\\[\\/imageText\\])", "gim");
        var cinfo_msg = msg.replace(imageText, function ($1, $2, $3) {
            return $3;
        });
        try {
            if (cinfo_msg != "") cinfo_msg = eval('(' + cinfo_msg + ')');
        } catch (e) {
        }
        try {
            if (cinfo_msg.logo != undefined && cinfo_msg.title != undefined && cinfo_msg.content != undefined && cinfo_msg.curl != undefined) {
                var cinfoHtml = getCinfoHtml(cinfo_msg.logo, cinfo_msg.title, cinfo_msg.content, cinfo_msg.curl);
                if (cinfoHtml != '') {
                    if (type == 'p') {
                        display_kf_msg(cinfoHtml, talkname, undefined, msg_time, undefined, 'last');
                    } else {
                        display_fk_msg(cinfoHtml, undefined, msg_time, 'last');
                    }
                }
                continue;
            }
        } catch (e) {
            continue;
        }
        msg = UBBCode(info[i].msg);
        msg = msg.replace(/(<br>)/g, "<br>");
        if (type == "p" || type == "h" || type == "a" || type == "b" || type == "j" || type == "m" || type == "u" || (is_show_web_msg && type == "r")) {
            display_kf_msg(msg, talkname, undefined, msg_time, undefined, 'last');
        }
        if (type == "g" || type == "q" || type == "k") {
            display_fk_msg(msg, undefined, msg_time, 'last');
        }
    }
}

function getWorkerCard() {
    var postdata = "company_id=" + company_id + "&id6d=" + obj_id + "&check_id=11917718fe939f3106d35a30074bcd30";
    if (obj_id == 0) {
        postdata = postdata + "&worker_id=" + worker_id;
    }
    $.ajax({
        type: "POST",
        url: "impl/rpc_worker_info_new.php",
        data: postdata,
        dataType: "json",
        success: function (result) {
            if (result.ecode == 0) {
                var data = result.data;
                showWorkerCard(data);
            }
        }
    });
}

function getUserCard() {
    $.ajax({
        type: 'POST',
        url: "impl/rpc_user_card.php?client=pc",
        data: "check_id=11917718fe939f3106d35a30074bcd30&company_id=" + company_id + "&guest_id=" + myid,
        dataType: 'json',
        success: function (data) {
            if (data.ecode == 0) {
                setLyItemsValue(data.info);
            }
        }
    });
}

function getWorkerNameById6d(id6d) {
    var name = langs[45];
    for (var i = 0; i < m_joinNames.length; i++) {
        var obj = m_joinNames[i];
        if (obj.jid6d == id6d) {
            return obj.name;
        }
    }
    $.ajax({
        type: "POST",
        url: "impl/rpc_worker_info_new.php",
        data: "company_id=" + company_id + "&id6d=" + id6d + "&check_id=11917718fe939f3106d35a30074bcd30",
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.ecode == 0) {
                var data = result.data;
                name = data['bname'];
                m_joinNames.push({'jid6d': id6d, 'name': name});
            }
        }
    });
    return name;
}

function getQrcode() {
    $.ajax({
        type: "POST",
        url: "impl/rpc_get_qrcode.php",
        data: "company_id=" + company_id + "&id6d=" + obj_id + "&guest_id=" + myid + "&talk_id=" + mytempid + "&style_id=" + style_id + "&style=" + style + "&kf_list=" + worker_ids,
        dataType: "json",
        success: function (result) {
            if (result.status == 'success') {
                qrcode_url = result.url;
                if (qrcode_url) addQrcode();
            } else {
                console.log(result.errmsg);
            }
        }
    });
}

function setOldKf() {
    if (isoldkf == 0 && getCookie("isoldkf_" + company_id + "_" + myid) != 1) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
        document.cookie = 'isoldkf_' + company_id + '_' + myid + "=1;expires=" + exp.toGMTString();
        isoldkf = 1;
    }
}

function netCallBack(ele) {
    if (callBackClick) return;
    var phone = '';
    if (ele) {
        phone = $(ele).parent().parent().attr('data_phone');
        var elm = $(ele).siblings('.call_phone_input');
        var val = elm.val();
        sendKafkaNew('guest_click_event', 'clue', 'phone');
    } else {
        var elm = $(".net_callBack_input");
        var val = $(".net_callBack_input").val();
    }
    var code = 0;
    if (/^(1[3-9]\d{9})$/.test(val)) {
        callBackClick = true;
        $.ajax({
            type: "POST",
            url: "impl/rpc_callback_phone.php?from=visitor",
            data: "company_id=" + company_id + "&id6d=" + obj_id + "&guest_id=" + myid + "&talk_id=" + myfirst_tempid + "&phone=" + phone + "&call=" + val + "&style_id=" + style_id + "&lnk_fire=" + lnk_fire + "&land_page=" + encodeURIComponent(landpage) + "&talk_page=" + encodeURIComponent(talkpage) + "&from_page=" + encodeURIComponent(frompage),
            dataType: "json",
            success: function (result) {
                var code = result.code;
                var call_id = result.call_id;
                var callNbr = result.callNbr;
                if (code == 0) {
                    var callNbrStr = '';
                    if (callNbr != '') {
                        callNbrStr = '拨打过来的号码为' + callNbr + '，';
                    }
                    var tips = '为了保护您的隐私，采用虚拟号，' + callNbrStr + '请放心接听';
                    display_sys_msg(tips);
                    $(".talk").removeClass("hasCallBack");
                } else if (code == 3) {
                    elm.addClass("error");
                    basic.toastOut(langs[73]);
                } else if (code == 4) {
                    display_sys_msg(langs[76]);
                    $(".talk").removeClass("hasCallBack");
                } else if (code == 8) {
                    basic.toastOut(langs[77]);
                } else if (code == 12) {
                    display_sys_msg(langs[78]);
                } else if (code == 13) {
                    display_sys_msg(langs[79]);
                } else if (code == 17) {
                    display_sys_msg(langs[79]);
                } else {
                    display_sys_msg(langs[72]);
                }
                g_comm.SendCallBackPhone(code, val, call_id);
                callBackClick = false;
            },
            error: function (data, status, e) {
                basic.toastOut(langs[31]);
                callBackClick = false;
            }
        });
    } else {
        elm.addClass("error");
        basic.toastOut(langs[73]);
    }
}

function init_comm() {
    try {
        g_comm = new CXMLClientKh(http_pro + host, "/sendmsg.jsp", true);
        callback_talk();
    } catch (e) {
    }
}

function callback_talk() {
    g_comm.OnErr = errProc;
    g_comm.OnDebug = debugProc;
    g_comm.OnLinkOpen = linkOpenProc;
    g_comm.OnLinkClose = linkCloseProc;
    g_comm.OnTimeOverClose = timeOverCloseProc;
    g_comm.OnRecvTalkMsg = recvTalkMsgProc;
    g_comm.OnRecvCinfoMsg = recvCinfoMsgProc;
    g_comm.OnRecvReceiveMsg = recvReceiveMsgProc;
    g_comm.OnTyping = typingProc;
    g_comm.OnSetupTyping = setupTypingProc;
    g_comm.OnRecvFile = recvFileProc;
    g_comm.OnWaitCount = waitCountProc;
    g_comm.OnRecvRlk = recvRlkProc;
    g_comm.OnLnkFail = lnkFailProc;
    g_comm.OnQstFail = qstFailProc;
    g_comm.OnFilFail = filFailProc;
    g_comm.OnRecvVote = recvVoteProc;
    g_comm.OnRecvQst = recvQstProc;
    g_comm.OnRecvReqst = recvReqstProc;
    g_comm.OnRecvRemsg = recvRemsgProc;
    g_comm.OnRecvGuestmenu = recvGuestmenuProc;
}

function linkOpenProc(errCode, errMsg, robotid) {
    clearTimeout(m_refreshTimer);
    if (obj_id != 0 && g_comm.GetKfid() != obj_id) is_swh = 1;
    myid = g_comm.GetGid();
    mytempid = g_comm.GetTid();
    myfirst_tempid = g_comm.GetFirstTid();
    obj_name = g_comm.GetKfname();
    obj_id = g_comm.GetKfid();
    khnumber = g_comm.GetKhnumber();
    CONST_NOTALK_TIP = (auto_disconnect - 3) * 60;
    CONST_KF_NOTALK_TIP = getKfPromptTime();
    setGuestId();
    if (obj_id == 0) {
        switch (errCode) {
            case'1':
                setOffLine();
                break;
            case'2':
                setOffLine();
                break;
            case'3':
                lnkover = 5;
                changeModule('busy');
                if (worker_ids.indexOf(",") == -1) {
                    getWorkerCard();
                }
                break;
            case'4':
                if (is_robotToTalk) {
                    showNoKfToTalk('robot');
                    is_robotToTalk = false;
                } else {
                    showzsk(robotid);
                }
                break;
            case'11':
                changeModule('black');
                display_sys_msg(UBBCode(UBBEncode(reject_prompt)));
                break;
            case'101':
                setOffLine();
                break;
            case'111':
                alert(langs[57]);
                var curUrl = window.location.href;
                window.location.href = curUrl;
                break;
        }
    } else {
        changeModule('lnksuccess');
        lnkover = 1;
        if (is_sceneToTalk) display_sys_msg(obj_name + " 为您服务");
        try {
            diaplay_cinfo_msg(comeinfo);
        } catch (e) {
        }
        if (typeof kefuCodeList[obj_id] == 'undefined') {
            admin_wx_code = '';
        } else {
            admin_wx_code = kefuCodeList[obj_id];
        }
        if (typeof visitorPathSwitchList[obj_id] == 'undefined') {
            visitorPathSwitch = '1';
        } else {
            visitorPathSwitch = visitorPathSwitchList[obj_id];
        }
        try {
            if (msg_wait_arr.length > 0) {
                for (var i = 0; i < msg_wait_arr.length; i++) {
                    qstmsg(UrlEncode(msg_wait_arr[i].msg), msg_wait_arr[i].fk_msgid, msg_wait_arr[i].msg_type, msg_wait_arr[i].msgid);
                }
            }
            msg_wait_arr = new Array();
        } catch (e) {
        }
        if (khnumber > 1 && !is_sceneToTalk) {
            playSound();
            g_comm.SendReceiveMsg();
            sendkafka("talk_info", "1");
        } else {
            try {
                handleCustMsg("lnk")
            } catch (e) {
            }
            getCusWebMsg();
            if (robotassign == '0' && is_swh != 1) {
                showConnPrompt();
            }
            try {
                if (comeinfo.sendtype == '1') sendCinfo();
            } catch (e) {
            }
        }
        if (m_ImKfNoTalkTimer == 0 && errCode == '6') {
            m_ImKfNoTalkTimer = setInterval('checkImKfNoTalk()', 1000);
            setImKfNoTalkVariable();
        }
        if (m_noTalkTimer == 0 && auto_disconnect != 0) {
            m_noTalkTimer = setInterval("checkNoTalk()", 1000);
        }
        if (m_typTimer == 0) {
            m_typTimer = setInterval("sendTypMsg()", 1000);
        }
        getWorkerCard();
        if (wx_drainage == '1' && wx_public_account == '1') getQrcode();
        if (!m_isShowInertactMenu) {
            m_isShowInertactMenu = true;
            try {
                menu.init(pc_inertact_menu);
            } catch (e) {
            }
        }
    }
}

function linkCloseProc(robid, arg, style, workerid, islink, iscswh, islink_companyId, iscswh_id6d, iscswh_companyId, code_arg, kf_sign) {
    clearInterval(m_noTalkTimer);
    clearInterval(m_kfNoTalkTimer);
    try {
        document.cookie = "hz6d_open_talk_" + company_id + "=0";
    } catch (e) {
    }
    g_comm.ShutDown(true);
    if (robid != "") {
        showzsk(robid);
        return;
    }
    if (arg != "") {
        var curUrl = window.location.href;
        curUrl_arr = curUrl.split("&");
        for (var i = 0; i < curUrl_arr.length; i++) {
            if (curUrl_arr[i].substr(0, 3) == "tpl") {
                var tpl = curUrl_arr[i].substr(4);
            }
            if (curUrl_arr[i].substr(0, 13) == "minchat_style") {
                var minchat_style = curUrl_arr[i].substr(14);
            }
        }
        var referer = curUrl.match(/&referer=[^&]*/gim);
        var keyword = curUrl.match(/&keyword=[^&]*/gim);
        var str = "";
        if (referer != null) str += referer;
        if (keyword != null) str += keyword;
        var href = http_pro + master_host + "/webCompany.php?arg=" + arg + "&style=" + style + "&cross=1" + str + "&is_swh=1";
        if (workerid != undefined && workerid != '') {
            href += "&switch_workerid=" + workerid;
        }
        if (islink == '1') href += "&islink=1&islink_companyId=" + islink_companyId;
        if (iscswh == '1') href += "&iscswh=1&iscswh_id6d=" + iscswh_id6d + "&iscswh_companyId=" + iscswh_companyId;
        if (code_arg != undefined && code_arg != '') href += "&code_arg=" + code_arg;
        if (kf_sign != undefined && kf_sign != '') href += "&kf_sign=" + kf_sign;
        if (tpl != "" && tpl != undefined && tpl != null) href = href + "&tpl=" + tpl;
        if (minchat_style != "" && minchat_style != undefined && minchat_style != null) href = href + "&minchat_style=" + minchat_style;
        location.href = href;
        return;
    }
    lnkover = 2;
    changeModule('talkend');
    display_sys_msg(UBBCode(UBBEncode(getKfPrompt('close_prompt'))));
    showVote();
    mytempid = 0;
    clearTYP();
    hiddenQuick();
    removeVisitorForm();
    try {
        top.postMessage('53kf_new_colse', '*');
    } catch (e) {
    }
}

function timeOverCloseProc(link) {
    clearInterval(m_noTalkTimer);
    clearInterval(m_kfNoTalkTimer);
    try {
        document.cookie = "hz6d_open_talk_" + company_id + "=0";
    } catch (e) {
    }
    g_comm.ShutDown(true);
    lnkover = 2;
    changeModule('talkend');
    display_sys_msg(UBBCode(UBBEncode(getKfPrompt('close_prompt'))));
    showVote();
    clearTYP();
    mytempid = 0;
    hiddenQuick();
    try {
        top.postMessage('53kf_new_colse', '*');
    } catch (e) {
    }
    removeVisitorForm();
}

function recvTalkMsgProc(msg, font, size, color, from, jid6d, sid, msgid, msg_type) {
    if (lnkover != 1) return;
    if (msg_type == 'z') {
        changeFormStatus('formid_' + msgid, true);
        return;
    }
    if (!isLoadVoice(msg)) {
        setTimeout(function () {
            recvTalkMsgProc(msg, font, size, color, from, jid6d, sid, msgid);
        }, 100);
        return;
    }
    msg = HtmlDecode(msg);
    msg = UBBCode(msg);
    msg = msg.replace(/(<br>)/g, "<br>");
    font = decodeURIComponent(font);
    size = decodeURIComponent(size);
    color = decodeURIComponent(color);
    if (color == '#000') color = color_kfxx;
    var style = "font-family:" + font + ";font-size:" + size + "px;color:" + color + ";background-color:" + color_kfqp + ";";
    var talkname = obj_name;
    if (jid6d != "") {
        talkname = getWorkerNameById6d(jid6d);
    }
    if (sid == obj_id) {
        playSound();
        setKfNoTalkVariable();
        setImKfNoTalkVariable();
        try {
            top.postMessage('53kf_new_msg', '*');
        } catch (e) {
        }
        display_kf_msg(msg, talkname, style, undefined, msgid);
        setOldKf();
        checkWechatByMsg(msg, 'w');
    } else {
        setNoTalkVariable();
        display_fk_msg(msg);
    }
    try {
        clearTimeout(carousel_id);
    } catch (e) {
    }
    if (imfocus == 0) {
        window.focus();
        kindeditor.focus();
    }
    clearTYP();
}

function recvCinfoMsgProc(logo, title, content, curl, msgType) {
    var cinfoHtml = getCinfoHtml(logo, title, content, curl);
    if (cinfoHtml != '') {
        if (msgType == 'p') {
            display_kf_msg(cinfoHtml);
        } else {
            display_fk_msg(cinfoHtml);
        }
    }
}

function recvQstProc(fk_msgid) {
    try {
        if (fk_msgid.indexOf('WU_FILE_') != -1) {
            $("#" + fk_msgid).find(".uploadStatus").text(langs[14]).css("color", "#1E88E5");
            if ($("#" + fk_msgid).find(".upload-image").length) {
                var url = $("#" + fk_msgid).data('url');
                $("#" + fk_msgid).html("<img src='" + url + "' />");
            }
        } else if (fk_msgid.indexOf('formid_') != -1) {
            changeFormStatus(fk_msgid, true);
        } else {
            $("#" + fk_msgid).removeClass('info-status');
            try {
                clearTimeout(m_qstResTimer[fk_msgid]);
                m_qstResTimer[fk_msgid] = null;
            } catch (e) {
            }
        }
    } catch (e) {
    }
}

function recvReceiveMsgProc(rowList) {
    var rowLength = XMLGetNodesLength(rowList);
    for (var i = 0; i < rowLength; i++) {
        var node = XMLGetNode(rowList, i);
        var type = XMLGetNamedAttr(node, "type");
        if (type == 's' || type == 'z') continue;
        var msg = XMLGetNamedAttr(node, "msg");
        if (i == 0) msg = UBBEncode(msg);
        if (!isLoadVoice(msg)) {
            setTimeout(function () {
                recvReceiveMsgProc(rowList);
            }, 100);
            return;
        }
    }
    for (var i = 0; i < rowLength; i++) {
        var node = XMLGetNode(rowList, i);
        var type = XMLGetNamedAttr(node, "type");
        var msg = XMLGetNamedAttr(node, "msg");
        msg = HtmlDecode(msg);
        if (i == 0) msg = UBBEncode(msg);
        var msg_time = XMLGetNamedAttr(node, "msg_time");
        var talkname = XMLGetNamedAttr(node, "kfname");
        if (type == 's' || type == 'z') continue;
        var msgid = XMLGetNamedAttr(node, "msgid");
        if (type == 'n') {
            var form_info = JSON.parse(msg);
            showVisitorForm(form_info.title, form_info.ids, "formid_" + msgid);
            continue;
        }
        var imageText = new RegExp("(\\[imageText\])([\\s\\S]+?)(\\[\\/imageText\\])", "gim");
        var cinfo_msg = msg.replace(imageText, function ($1, $2, $3) {
            return $3;
        });
        try {
            if (cinfo_msg != "") cinfo_msg = eval('(' + cinfo_msg + ')');
        } catch (e) {
        }
        try {
            if (cinfo_msg.logo != undefined && cinfo_msg.title != undefined && cinfo_msg.content != undefined && cinfo_msg.curl != undefined) {
                var cinfoHtml = getCinfoHtml(cinfo_msg.logo, cinfo_msg.title, cinfo_msg.content, cinfo_msg.curl);
                if (cinfoHtml != '') {
                    if (type == 'p') {
                        display_kf_msg(cinfoHtml);
                    } else {
                        display_fk_msg(cinfoHtml);
                    }
                }
                continue;
            }
        } catch (e) {
            continue;
        }
        if (msg.indexOf('down_file.php?') != -1 && msg.indexOf('file=upload/files') != -1) {
            var reg = new RegExp("(\\[URL=(.+?)\])(.+?)(\\[\\/URL\\])", "gim");
            var name, url;
            msg = msg.replace(reg, function ($1, $2, $3, $4) {
                name = $4;
                url = $3;
                return $1;
            });
            if (type == 'p' || type == "r" || type == "h") {
                display_fil_msg(name, url, obj_id);
            } else {
                display_fil_msg(name, url, myid);
            }
            continue;
        }
        if (talkname == '') talkname = langs[45];
        msg = UBBCode(msg);
        msg = msg.replace(/(<br>)/g, "<br>");
        if (type == 'p' || type == "r" || type == "h" || type == "q" || type == "k" || type == "b" || type == "j" || type == "m" || type == "u") {
            if (msg) {
                if (msg.indexOf("http://kfs3") != -1 || msg.indexOf("https://kfs3") != -1) {
                    displayAsVideoAudio(msg, undefined, msg_time, "kf", talkname);
                } else {
                    display_kf_msg(msg, talkname, undefined, msg_time, msgid);
                }
            }
        } else if (type == 'f') {
            display_kf_msg(langs[86], talkname, undefined, msg_time);
        } else {
            if (msg.indexOf("http://kfs3") != -1 || msg.indexOf("https://kfs3") != -1) {
                displayAsVideoAudio(msg, undefined, msg_time, "fk", talkname);
            } else {
                display_fk_msg(msg, undefined, msg_time);
            }
        }
    }
    setTimeout(function () {
        basic.scrollPage();
    }, 100);
}

function recvFileProc(fileName, sid, jid6d, type, file_cancel_id, size) {
    if (lnkover != 1) return;
    setKfNoTalkVariable();
    setImKfNoTalkVariable();
    try {
        clearTimeout(carousel_id);
    } catch (e) {
    }
    playSound();
    var name = getStringField(fileName, "*", 2);
    var url = getStringField(fileName, "*", 1);
    display_fil_msg(name, url, sid, jid6d, type, file_cancel_id, size);
    if (imfocus == 0) {
        window.focus();
        kindeditor.focus();
    }
    clearTYP();
    try {
        top.postMessage('53kf_new_msg', '*');
    } catch (e) {
    }
}

function recvReqstProc(file_cancel_id, msg) {
    try {
        if ($("#" + file_cancel_id).length >= 1) {
            $("#" + file_cancel_id).remove();
        } else {
            if (msg.indexOf('down_file.php?file=upload/files') != -1 || msg.indexOf("http://kfs3") != -1 || msg.indexOf("https://kfs3") != -1) {
                var reg = new RegExp("(\\[URL=(.+?)\])(.+?)(\\[\\/URL\\])", "gim");
                var url;
                msg = msg.replace(reg, function ($1, $2, $3, $4) {
                    url = $3;
                    return $1;
                });
                $(".file_cancel").each(function () {
                    if (msg.indexOf('down_file.php?file=upload/files') != -1) {
                        if ($(this).find('a').attr('href') == url) {
                            $(this).remove();
                            return false;
                        }
                    } else {
                        url = HtmlDecode(url);
                        if ($(this).find('audio').attr('src') == url) {
                            $(this).remove();
                            return false;
                        } else if ($(this).find('video').attr('src') == url) {
                            $(this).remove();
                            return false;
                        }
                    }
                });
            }
        }
    } catch (e) {
    }
}

function recvRemsgProc(msgid) {
    try {
        if ($("#" + msgid).length >= 1) {
            $("#" + msgid).remove();
        }
    } catch (e) {
    }
}

function recvGuestmenuProc(title, ids, msgid) {
    try {
        showVisitorForm(title, ids, "formid_" + msgid);
        clearTimeout(carousel_id);
    } catch (e) {
    }
}

function waitCountProc(cnt) {
    if (cnt < 0) {
        setOffLine();
    } else {
        m_busyCnt = parseInt(cnt) + 1;
        if (lnkover == 5) {
            $(".personNum").html(m_busyCnt);
        }
    }
}

function recvRlkProc() {
    display_sys_msg(langs[59]);
    getCusWebMsg();
}

function lnkFailProc() {
    display_sys_msg(langs[62]);
}

function qstFailProc(msg) {
}

function send_FIL(filename, type, size) {
    setNoTalkVariable();
    g_comm.SendFile(filename, type, size);
    try {
        clearTimeout(carousel_id);
    } catch (e) {
    }
}

function filFailProc() {
    display_sys_msg(langs[63]);
}

function errProc(ecode, message) {
}

function debugProc(dbgInfo) {
}

function typingProc() {
    setTYP();
}

function recvVoteProc(id6d, state) {
    if (kfpf == 0) {
        replayVote("4");
    } else if (vote_true) {
        replayVote("3");
    } else {
        showVote();
    }
}

function replayVote(state) {
    g_comm.SendVote(state);
}

function setQstResTimer(fk_msgid) {
    if (fk_msgid != undefined) {
        try {
            m_qstResTimer[fk_msgid] = setTimeout(function () {
                $("#" + fk_msgid).addClass("onError");
            }, 20000);
        } catch (e) {
        }
    }
}

function quickQA(obj, cmd, type_id, question_id, wd) {
    var robid = 0;
    if (cmd == undefined) {
        cmd = "GetHotList";
        type_id = 0;
        question_id = "";
        wd = "";
        if (robot_id != '') {
            robid = robot_id;
        }
    } else {
        robid = robot_id;
    }
    try {
        var senddata = "cmd=" + cmd + "&company_id=" + company_id + "&robot_id=" + robid + "&type_id=" + type_id + "&question_id=" + question_id + "&wd=" + wd;
        var url = "impl/zsk.php";
        var xmlhttp = createHttpRequest();
        xmlhttp.open("POST", url, false);
        xmlhttp.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        xmlhttp.send(senddata);
        var dom = xmlhttp.responseXML;
        var rspNodes = XMLGetNodes(dom, "Response");
        var rspNode = XMLGetNode(rspNodes, 0);
        if (rspNode != null) {
            var ecode = XMLGetNamedAttr(rspNode, "ecode");
            var cmd = XMLGetNamedAttr(rspNode, "cmd");
        } else {
            return;
        }
        if (ecode == 0) {
            switch (cmd) {
                case"GetHotList":
                    var hotArray = new Array();
                    var datas = XMLGetNodes(rspNode, "Data");
                    var data = XMLGetNode(datas, 0);
                    var rowList = XMLGetNodes(data, "row");
                    var nodeLength = XMLGetNodesLength(rowList);
                    for (var i = 0; i < nodeLength; i++) {
                        var node = XMLGetNode(rowList, i);
                        var hot = new Object();
                        hot.id = XMLGetNamedAttr(node, "id");
                        hot.question = XMLGetNamedAttr(node, "question");
                        hotArray.push(hot);
                    }
                    showQuickList(obj, hotArray);
                    break;
                case"GetAnswer":
                    setKfNoTalkVariable();
                    setImKfNoTalkVariable();
                    var answer = XMLGetNamedAttr(rspNode, "answer");
                    display_kf_msg(UBBCode(UBBEncode(answer.replace(/(\n)/g, "<br>"))));
                    getClueByMsg(answer, "w");
                    break;
                default:
                    break;
            }
        } else if (ecode == 1) {
            basic.toastOut(langs[46]);
        } else if (ecode == 2) {
            basic.toastOut(langs[47]);
        }
    } catch (e) {
    }
}

function showQuickList(obj, hotArray) {
    var html = new Array();
    var len = hotArray.length;
    if (len != 0) {
        for (var i = 0; i < len; i++) {
            var hot = hotArray[i];
            var id = hot.id;
            var question = hot.question;
            html.push("<p onclick='getQuickAnswer(\"" + id + "\",\"" + question.replace(/\\/g, "\\\\").replace(/&quot;/g, "\\&quot;") + "\")' title='" + question + "'>" + question + "</p>");
        }
    } else {
        html.push("<p>" + langs[48] + "</p>");
    }
    $(".service-help").html(html.join(""));
}

function getQuickAnswer(id, question) {
    $.get("dpp_debug.php", {"action": "getQuickAnswer"});
    setNoTalkVariable();
    display_fk_msg(question);
    getClueByMsg(question, "v");
    quickQA("", "GetAnswer", "", id);
    hiddenQuick();
}

function checkCodeSuccess(vcode) {
    if (m_checkCodeType == 1) {
        if (hasOnlineKf == '1') {
            setOnLine(true);
        } else {
            setOffLine();
        }
    } else if (m_checkCodeType == 2) {
        submit_lword(vcode);
    }
}

function checkCodeError() {
    if (m_checkCodeType == 2) {
        lyClick = false;
        basic.toastOut(langs[31]);
        $("#submit_lword").text(langs[6]).removeClass("loading");
    }
}

function zn_order() {
    if (lnkover == 6 && isset_prompt_cookie == 0) {
        var time = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        var expires = new Date();
        expires.setTime(time);
        document.cookie = "prompt_guide_" + company_id + "=1; expires=" + expires.toGMTString();
        isset_prompt_cookie = 1;
        sendLNK();
    }
}

function sendkafka(type, device, number, time, vote) {
    var talk_time = '0';
    if (time) talk_time = time;
    var senddata = '';
    var curUrl = window.location.href;
    if (curUrl.indexOf("is_swh=1") != -1) is_swh = 1;
    if (type == 'type') {
        senddata = "&type=" + type + "&talk_id=" + mytempid + "&company_id=" + company_id + "&guest_id=" + myid + "&talk_type=" + talk_type + "&talk_time=" + talk_time + "&device=" + device + "&guest_ip_info=" + UrlEncode(guest_ip_info) + "&talk_page=" + UrlEncode(talkpage) + "&talk_quality=0&number=" + number + "&se=" + UrlEncode(search_engine) + "&kw=" + UrlEncode(keyword) + "&referer=" + UrlEncode(frompage) + "&is_swh=" + is_swh + "&land_page=" + UrlEncode(landpage);
    } else if (type == 'vote') {
        senddata = "&type=" + type + "&talk_id=" + myfirst_tempid + "&company_id=" + company_id + "&id6d=" + obj_id + "&talk_time=" + talk_time + "&number=" + number + "&vote=" + vote + "&device=" + device;
    } else if (type == "talk_info") {
        senddata = "&type=talk_info&uid=" + uid + "&talk_id=" + myfirst_tempid + "&company_id=" + company_id + "&guest_id=" + myid + "&open_time=" + open_time + "&device=" + device + "&guest_ip_info=" + UrlEncode(guest_ip_info) + "&talk_page=" + UrlEncode(talkpage) + "&se=" + UrlEncode(search_engine) + "&kw=" + UrlEncode(keyword) + "&referer=" + UrlEncode(frompage) + "&id6d=" + obj_id + "&tFrom=" + tfrom;
    }
    $.ajax({
        type: "POST", url: "company_collection.php", data: senddata, dataType: "json", success: function (data) {
            if (data.result == 'succeed' && talk_type == '3') {
                origin_time = data.talk_time;
            }
        }
    });
}

function sendKafkaNew(type, cmd, clue_type, msg) {
    var now = new Date();
    var talk_time = now.getTime();
    senddata = "&type=" + type + "&guest_id=" + myid + "&talk_id=" + myfirst_tempid + "&company_id=" + company_id + "&id6d=" + obj_id + "&style_id=" + style_id + "&talk_time=" + talk_time + "&kw=" + UrlEncode(keyword) + "&se=" + UrlEncode(search_engine) + "&from_page=" + UrlEncode(frompage) + "&land_page=" + UrlEncode(landpage) + "&talk_page=" + UrlEncode(talkpage) + "&guest_ip_info=" + UrlEncode(guest_ip_info) + "&device=1";
    if (cmd != '' && cmd != undefined) {
        senddata = senddata + '&cmd=' + cmd;
    }
    if (clue_type != '' && clue_type != undefined) {
        senddata = senddata + '&clue_type=' + clue_type;
    }
    if (msg != '' && msg != undefined) {
        senddata = senddata + '&msg=' + msg;
    }
    $.ajax({
        type: "POST", url: "company_collection.php", data: senddata, dataType: "json", success: function (data) {
        }
    });
}

function createHttpRequest() {
    try {
        var httpRequest = new ActiveXObject("MSXML2.XMLHTTP");
    } catch (e) {
        var httpRequest = new XMLHttpRequest();
    }
    return httpRequest;
};$(function () {
    jQuery.extend({
        createUploadIframe: function (id, uri) {
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
            if (window.ActiveXObject) {
                if (typeof uri == 'boolean') {
                    iframeHtml += ' src="' + 'javascript:false' + '"';
                } else if (typeof uri == 'string') {
                    iframeHtml += ' src="' + uri + '"';
                }
            }
            iframeHtml += ' />';
            jQuery(iframeHtml).appendTo(document.body);
            return jQuery('#' + frameId).get(0);
        }, createUploadForm: function (id, fileElementId, data) {
            var formId = 'jUploadForm' + id;
            var fileId = 'jUploadFile' + id;
            var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
            if (data) {
                for (var i in data) {
                    jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
                }
            }
            var oldElement = jQuery('#' + fileElementId);
            var newElement = jQuery(oldElement).clone();
            jQuery(oldElement).attr('id', fileId);
            jQuery(oldElement).before(newElement);
            jQuery(oldElement).appendTo(form);
            jQuery(form).css('position', 'absolute');
            jQuery(form).css('top', '-1200px');
            jQuery(form).css('left', '-1200px');
            jQuery(form).appendTo('body');
            return form;
        }, ajaxFileUpload: function (s) {
            s = jQuery.extend({}, jQuery.ajaxSettings, s);
            var id = new Date().getTime();
            var form = jQuery.createUploadForm(id, s.fileElementId, (typeof (s.data) == 'undefined' ? false : s.data));
            var io = jQuery.createUploadIframe(id, s.secureuri);
            var frameId = 'jUploadFrame' + id;
            var formId = 'jUploadForm' + id;
            if (s.global && !jQuery.active++) {
                jQuery.event.trigger("ajaxStart");
            }
            var requestDone = false;
            var xml = {}
            if (s.global)
                jQuery.event.trigger("ajaxSend", [xml, s]);
            var uploadCallback = function (isTimeout) {
                var io = document.getElementById(frameId);
                try {
                    if (io.contentWindow) {
                        xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                        xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                    } else if (io.contentDocument) {
                        xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                        xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                    }
                    if (xml.responseText.indexOf('<div id="myKfCapturteCustomEvent" style="display: none;"></div>') != -1) {
                        xml.responseText = xml.responseText.replace('<div id="myKfCapturteCustomEvent" style="display: none;"></div>', '');
                    }
                } catch (e) {
                    jQuery.handleError(s, xml, null, e);
                }
                if (xml || isTimeout == "timeout") {
                    requestDone = true;
                    var status;
                    try {
                        status = isTimeout != "timeout" ? "success" : "error";
                        if (status != "error") {
                            var data = jQuery.uploadHttpData(xml, s.dataType);
                            if (s.success)
                                s.success(data, status);
                            if (s.global)
                                jQuery.event.trigger("ajaxSuccess", [xml, s]);
                        } else
                            jQuery.handleError(s, xml, status);
                    } catch (e) {
                        status = "error";
                        jQuery.handleError(s, xml, status, e);
                    }
                    if (s.global)
                        jQuery.event.trigger("ajaxComplete", [xml, s]);
                    if (s.global && !--jQuery.active)
                        jQuery.event.trigger("ajaxStop");
                    if (s.complete)
                        s.complete(xml, status);
                    jQuery(io).unbind()
                    setTimeout(function () {
                        try {
                            jQuery(io).remove();
                            jQuery(form).remove();
                        } catch (e) {
                            jQuery.handleError(s, xml, null, e);
                        }
                    }, 100)
                    xml = null
                }
            }
            if (s.timeout > 0) {
                setTimeout(function () {
                    if (!requestDone) uploadCallback("timeout");
                }, s.timeout);
            }
            try {
                var form = jQuery('#' + formId);
                jQuery(form).attr('action', s.url);
                jQuery(form).attr('method', 'POST');
                jQuery(form).attr('target', frameId);
                if (form.encoding) {
                    jQuery(form).attr('encoding', 'multipart/form-data');
                } else {
                    jQuery(form).attr('enctype', 'multipart/form-data');
                }
                jQuery(form).submit();
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            jQuery('#' + frameId).load(uploadCallback);
            return {
                abort: function () {
                }
            };
        }, uploadHttpData: function (r, type) {
            var data = !type;
            data = type == "xml" || data ? r.responseXML : r.responseText;
            if (type == "script")
                jQuery.globalEval(data);
            if (type == "json")
                eval("data = " + data);
            if (type == "html")
                jQuery("<div>").html(data).evalScripts();
            return data;
        }, handleError: function (s, xhr, status, e) {
            if (s.error) {
                s.error.call(s.context || s, xhr, status, e);
            }
            if (s.global) {
                (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
            }
        }
    })
});
(function (name, context, definition) {
    'use strict'
    if (typeof window.define === 'function' && window.define.amd) {
        window.define(definition)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition()
    } else if (context.exports) {
        context.exports = definition()
    } else {
        context[name] = definition()
    }
})('Fingerprint2', this, function () {
    'use strict'
    var Fingerprint2 = function (options) {
        if (!(this instanceof Fingerprint2)) {
            return new Fingerprint2(options)
        }
        var defaultOptions = {
            swfContainerId: 'fingerprintjs2',
            swfPath: 'flash/compiled/FontList.swf',
            detectScreenOrientation: true,
            sortPluginsFor: [/palemoon/i],
            userDefinedFonts: [],
            excludeDoNotTrack: true,
            excludePixelRatio: true
        }
        this.options = this.extend(options, defaultOptions)
        this.nativeForEach = Array.prototype.forEach
        this.nativeMap = Array.prototype.map
    }
    Fingerprint2.prototype = {
        extend: function (source, target) {
            if (source == null) {
                return target
            }
            for (var k in source) {
                if (source[k] != null && target[k] !== source[k]) {
                    target[k] = source[k]
                }
            }
            return target
        }, get: function (done) {
            var that = this
            var keys = {
                data: [], addPreprocessedComponent: function (pair) {
                    var componentValue = pair.value
                    if (typeof that.options.preprocessor === 'function') {
                        componentValue = that.options.preprocessor(pair.key, componentValue)
                    }
                    keys.data.push({key: pair.key, value: componentValue})
                }
            }
            keys = this.userAgentKey(keys)
            keys = this.languageKey(keys)
            keys = this.colorDepthKey(keys)
            keys = this.deviceMemoryKey(keys)
            keys = this.pixelRatioKey(keys)
            keys = this.hardwareConcurrencyKey(keys)
            keys = this.screenResolutionKey(keys)
            keys = this.availableScreenResolutionKey(keys)
            keys = this.timezoneOffsetKey(keys)
            keys = this.sessionStorageKey(keys)
            keys = this.localStorageKey(keys)
            keys = this.indexedDbKey(keys)
            keys = this.addBehaviorKey(keys)
            keys = this.openDatabaseKey(keys)
            keys = this.cpuClassKey(keys)
            keys = this.platformKey(keys)
            keys = this.doNotTrackKey(keys)
            keys = this.pluginsKey(keys)
            keys = this.canvasKey(keys)
            keys = this.webglKey(keys)
            keys = this.webglVendorAndRendererKey(keys)
            keys = this.adBlockKey(keys)
            keys = this.hasLiedLanguagesKey(keys)
            keys = this.hasLiedResolutionKey(keys)
            keys = this.hasLiedOsKey(keys)
            keys = this.hasLiedBrowserKey(keys)
            keys = this.touchSupportKey(keys)
            keys = this.customEntropyFunction(keys)
            this.fontsKey(keys, function (newKeys) {
                var values = []
                that.each(newKeys.data, function (pair) {
                    var value = pair.value
                    if (value && typeof value.join === 'function') {
                        value = value.join(';')
                    }
                    values.push(value)
                })
                var murmur = that.x64hash128(values.join('~~~'), 31)
                return done(murmur, newKeys.data)
            })
        }, customEntropyFunction: function (keys) {
            if (typeof this.options.customFunction === 'function') {
                keys.addPreprocessedComponent({key: 'custom', value: this.options.customFunction()})
            }
            return keys
        }, userAgentKey: function (keys) {
            if (!this.options.excludeUserAgent) {
                keys.addPreprocessedComponent({key: 'user_agent', value: this.getUserAgent()})
            }
            return keys
        }, getUserAgent: function () {
            return navigator.userAgent
        }, languageKey: function (keys) {
            if (!this.options.excludeLanguage) {
                keys.addPreprocessedComponent({
                    key: 'language',
                    value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || ''
                })
            }
            return keys
        }, colorDepthKey: function (keys) {
            if (!this.options.excludeColorDepth) {
                keys.addPreprocessedComponent({key: 'color_depth', value: window.screen.colorDepth || -1})
            }
            return keys
        }, deviceMemoryKey: function (keys) {
            if (!this.options.excludeDeviceMemory) {
                keys.addPreprocessedComponent({key: 'device_memory', value: this.getDeviceMemory()})
            }
            return keys
        }, getDeviceMemory: function () {
            return navigator.deviceMemory || -1
        }, pixelRatioKey: function (keys) {
            if (!this.options.excludePixelRatio) {
                keys.addPreprocessedComponent({key: 'pixel_ratio', value: this.getPixelRatio()})
            }
            return keys
        }, getPixelRatio: function () {
            return window.devicePixelRatio || ''
        }, screenResolutionKey: function (keys) {
            if (!this.options.excludeScreenResolution) {
                return this.getScreenResolution(keys)
            }
            return keys
        }, getScreenResolution: function (keys) {
            var resolution
            if (this.options.detectScreenOrientation) {
                resolution = (window.screen.height > window.screen.width) ? [window.screen.height, window.screen.width] : [window.screen.width, window.screen.height]
            } else {
                resolution = [window.screen.width, window.screen.height]
            }
            keys.addPreprocessedComponent({key: 'resolution', value: resolution})
            return keys
        }, availableScreenResolutionKey: function (keys) {
            if (!this.options.excludeAvailableScreenResolution) {
                return this.getAvailableScreenResolution(keys)
            }
            return keys
        }, getAvailableScreenResolution: function (keys) {
            var available
            if (window.screen.availWidth && window.screen.availHeight) {
                if (this.options.detectScreenOrientation) {
                    available = (window.screen.availHeight > window.screen.availWidth) ? [window.screen.availHeight, window.screen.availWidth] : [window.screen.availWidth, window.screen.availHeight]
                } else {
                    available = [window.screen.availHeight, window.screen.availWidth]
                }
            }
            if (typeof available !== 'undefined') {
                keys.addPreprocessedComponent({key: 'available_resolution', value: available})
            }
            return keys
        }, timezoneOffsetKey: function (keys) {
            if (!this.options.excludeTimezoneOffset) {
                keys.addPreprocessedComponent({key: 'timezone_offset', value: new Date().getTimezoneOffset()})
            }
            return keys
        }, sessionStorageKey: function (keys) {
            if (!this.options.excludeSessionStorage && this.hasSessionStorage()) {
                keys.addPreprocessedComponent({key: 'session_storage', value: 1})
            }
            return keys
        }, localStorageKey: function (keys) {
            if (!this.options.excludeSessionStorage && this.hasLocalStorage()) {
                keys.addPreprocessedComponent({key: 'local_storage', value: 1})
            }
            return keys
        }, indexedDbKey: function (keys) {
            if (!this.options.excludeIndexedDB && this.hasIndexedDB()) {
                keys.addPreprocessedComponent({key: 'indexed_db', value: 1})
            }
            return keys
        }, addBehaviorKey: function (keys) {
            if (!this.options.excludeAddBehavior && document.body && document.body.addBehavior) {
                keys.addPreprocessedComponent({key: 'add_behavior', value: 1})
            }
            return keys
        }, openDatabaseKey: function (keys) {
            if (!this.options.excludeOpenDatabase && window.openDatabase) {
                keys.addPreprocessedComponent({key: 'open_database', value: 1})
            }
            return keys
        }, cpuClassKey: function (keys) {
            if (!this.options.excludeCpuClass) {
                keys.addPreprocessedComponent({key: 'cpu_class', value: this.getNavigatorCpuClass()})
            }
            return keys
        }, platformKey: function (keys) {
            if (!this.options.excludePlatform) {
                keys.addPreprocessedComponent({key: 'navigator_platform', value: this.getNavigatorPlatform()})
            }
            return keys
        }, doNotTrackKey: function (keys) {
            if (!this.options.excludeDoNotTrack) {
                keys.addPreprocessedComponent({key: 'do_not_track', value: this.getDoNotTrack()})
            }
            return keys
        }, canvasKey: function (keys) {
            if (!this.options.excludeCanvas && this.isCanvasSupported()) {
                keys.addPreprocessedComponent({key: 'canvas', value: this.getCanvasFp()})
            }
            return keys
        }, webglKey: function (keys) {
            if (!this.options.excludeWebGL && this.isWebGlSupported()) {
                keys.addPreprocessedComponent({key: 'webgl', value: this.getWebglFp()})
            }
            return keys
        }, webglVendorAndRendererKey: function (keys) {
            if (!this.options.excludeWebGLVendorAndRenderer && this.isWebGlSupported()) {
                keys.addPreprocessedComponent({key: 'webgl_vendor', value: this.getWebglVendorAndRenderer()})
            }
            return keys
        }, adBlockKey: function (keys) {
            if (!this.options.excludeAdBlock) {
                keys.addPreprocessedComponent({key: 'adblock', value: this.getAdBlock()})
            }
            return keys
        }, hasLiedLanguagesKey: function (keys) {
            if (!this.options.excludeHasLiedLanguages) {
                keys.addPreprocessedComponent({key: 'has_lied_languages', value: this.getHasLiedLanguages()})
            }
            return keys
        }, hasLiedResolutionKey: function (keys) {
            if (!this.options.excludeHasLiedResolution) {
                keys.addPreprocessedComponent({key: 'has_lied_resolution', value: this.getHasLiedResolution()})
            }
            return keys
        }, hasLiedOsKey: function (keys) {
            if (!this.options.excludeHasLiedOs) {
                keys.addPreprocessedComponent({key: 'has_lied_os', value: this.getHasLiedOs()})
            }
            return keys
        }, hasLiedBrowserKey: function (keys) {
            if (!this.options.excludeHasLiedBrowser) {
                keys.addPreprocessedComponent({key: 'has_lied_browser', value: this.getHasLiedBrowser()})
            }
            return keys
        }, fontsKey: function (keys, done) {
            if (this.options.excludeJsFonts) {
                return this.flashFontsKey(keys, done)
            }
            return this.jsFontsKey(keys, done)
        }, flashFontsKey: function (keys, done) {
            if (this.options.excludeFlashFonts) {
                return done(keys)
            }
            if (!this.hasSwfObjectLoaded()) {
                return done(keys)
            }
            if (!this.hasMinFlashInstalled()) {
                return done(keys)
            }
            if (typeof this.options.swfPath === 'undefined') {
                return done(keys)
            }
            this.loadSwfAndDetectFonts(function (fonts) {
                keys.addPreprocessedComponent({key: 'swf_fonts', value: fonts.join(';')})
                done(keys)
            })
        }, jsFontsKey: function (keys, done) {
            var that = this
            return setTimeout(function () {
                var baseFonts = ['monospace', 'sans-serif', 'serif']
                var fontList = ['Andale Mono', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Bitstream Vera Sans Mono', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Cambria', 'Cambria Math', 'Century', 'Century Gothic', 'Century Schoolbook', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New', 'Geneva', 'Georgia', 'Helvetica', 'Helvetica Neue', 'Impact', 'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Monaco', 'Monotype Corsiva', 'MS Gothic', 'MS Outlook', 'MS PGothic', 'MS Reference Sans Serif', 'MS Sans Serif', 'MS Serif', 'MYRIAD', 'MYRIAD PRO', 'Palatino', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Tahoma', 'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS', 'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3']
                var extendedFontList = ['Abadi MT Condensed Light', 'Academy Engraved LET', 'ADOBE CASLON PRO', 'Adobe Garamond', 'ADOBE GARAMOND PRO', 'Agency FB', 'Aharoni', 'Albertus Extra Bold', 'Albertus Medium', 'Algerian', 'Amazone BT', 'American Typewriter', 'American Typewriter Condensed', 'AmerType Md BT', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Antique Olive', 'Aparajita', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arabic Typesetting', 'ARCHER', 'ARNO PRO', 'Arrus BT', 'Aurora Cn BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'AVENIR', 'Ayuthaya', 'Bandy', 'Bangla Sangam MN', 'Bank Gothic', 'BankGothic Md BT', 'Baskerville', 'Baskerville Old Face', 'Batang', 'BatangChe', 'Bauer Bodoni', 'Bauhaus 93', 'Bazooka', 'Bell MT', 'Bembo', 'Benguiat Bk BT', 'Berlin Sans FB', 'Berlin Sans FB Demi', 'Bernard MT Condensed', 'BernhardFashion BT', 'BernhardMod BT', 'Big Caslon', 'BinnerD', 'Blackadder ITC', 'BlairMdITC TT', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni MT', 'Bodoni MT Black', 'Bodoni MT Condensed', 'Bodoni MT Poster Compressed', 'Bookshelf Symbol 7', 'Boulder', 'Bradley Hand', 'Bradley Hand ITC', 'Bremen Bd BT', 'Britannic Bold', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Californian FB', 'Calisto MT', 'Calligrapher', 'Candara', 'CaslonOpnface BT', 'Castellar', 'Centaur', 'Cezanne', 'CG Omega', 'CG Times', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charlesworth', 'Charter Bd BT', 'Charter BT', 'Chaucer', 'ChelthmITC Bk BT', 'Chiller', 'Clarendon', 'Clarendon Condensed', 'CloisterBlack BT', 'Cochin', 'Colonna MT', 'Constantia', 'Cooper Black', 'Copperplate', 'Copperplate Gothic', 'Copperplate Gothic Bold', 'Copperplate Gothic Light', 'CopperplGoth Bd BT', 'Corbel', 'Cordia New', 'CordiaUPC', 'Cornerstone', 'Coronet', 'Cuckoo', 'Curlz MT', 'DaunPenh', 'Dauphin', 'David', 'DB LCD Temp', 'DELICIOUS', 'Denmark', 'DFKai-SB', 'Didot', 'DilleniaUPC', 'DIN', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Edwardian Script ITC', 'Elephant', 'English 111 Vivace BT', 'Engravers MT', 'EngraversGothic BT', 'Eras Bold ITC', 'Eras Demi ITC', 'Eras Light ITC', 'Eras Medium ITC', 'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'EUROSTILE', 'Exotc350 Bd BT', 'FangSong', 'Felix Titling', 'Fixedsys', 'FONTIN', 'Footlight MT Light', 'Forte', 'FrankRuehl', 'Fransiscan', 'Freefrm721 Blk BT', 'FreesiaUPC', 'Freestyle Script', 'French Script MT', 'FrnkGothITC Bk BT', 'Fruitger', 'FRUTIGER', 'Futura', 'Futura Bk BT', 'Futura Lt BT', 'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Gabriola', 'Galliard BT', 'Gautami', 'Geeza Pro', 'Geometr231 BT', 'Geometr231 Hv BT', 'Geometr231 Lt BT', 'GeoSlab 703 Lt BT', 'GeoSlab 703 XBd BT', 'Gigi', 'Gill Sans', 'Gill Sans MT', 'Gill Sans MT Condensed', 'Gill Sans MT Ext Condensed Bold', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed', 'Gisha', 'Gloucester MT Extra Condensed', 'GOTHAM', 'GOTHAM BOLD', 'Goudy Old Style', 'Goudy Stout', 'GoudyHandtooled BT', 'GoudyOLSt BT', 'Gujarati Sangam MN', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe', 'Gurmukhi MN', 'Haettenschweiler', 'Harlow Solid Italic', 'Harrington', 'Heather', 'Heiti SC', 'Heiti TC', 'HELV', 'Herald', 'High Tower Text', 'Hiragino Kaku Gothic ProN', 'Hiragino Mincho ProN', 'Hoefler Text', 'Humanst 521 Cn BT', 'Humanst521 BT', 'Humanst521 Lt BT', 'Imprint MT Shadow', 'Incised901 Bd BT', 'Incised901 BT', 'Incised901 Lt BT', 'INCONSOLATA', 'Informal Roman', 'Informal011 BT', 'INTERSTATE', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Jazz LET', 'Jenson', 'Jester', 'Jokerman', 'Juice ITC', 'Kabel Bk BT', 'Kabel Ult BT', 'Kailasa', 'KaiTi', 'Kalinga', 'Kannada Sangam MN', 'Kartika', 'Kaufmann Bd BT', 'Kaufmann BT', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korinna BT', 'Kristen ITC', 'Krungthep', 'Kunstler Script', 'Lao UI', 'Latha', 'Leelawadee', 'Letter Gothic', 'Levenim MT', 'LilyUPC', 'Lithograph', 'Lithograph Light', 'Long Island', 'Lydian BT', 'Magneto', 'Maiandra GD', 'Malayalam Sangam MN', 'Malgun Gothic', 'Mangal', 'Marigold', 'Marion', 'Marker Felt', 'Market', 'Marlett', 'Matisse ITC', 'Matura MT Script Capitals', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Minion', 'Minion Pro', 'Miriam', 'Miriam Fixed', 'Mistral', 'Modern', 'Modern No. 20', 'Mona Lisa Solid ITC TT', 'Mongolian Baiti', 'MONO', 'MoolBoran', 'Mrs Eaves', 'MS LineDraw', 'MS Mincho', 'MS PMincho', 'MS Reference Specialty', 'MS UI Gothic', 'MT Extra', 'MUSEO', 'MV Boli', 'Nadeem', 'Narkisim', 'NEVIS', 'News Gothic', 'News GothicMT', 'NewsGoth BT', 'Niagara Engraved', 'Niagara Solid', 'Noteworthy', 'NSimSun', 'Nyala', 'OCR A Extended', 'Old Century', 'Old English Text MT', 'Onyx', 'Onyx BT', 'OPTIMA', 'Oriya Sangam MN', 'OSAKA', 'OzHandicraft BT', 'Palace Script MT', 'Papyrus', 'Parchment', 'Party LET', 'Pegasus', 'Perpetua', 'Perpetua Titling MT', 'PetitaBold', 'Pickwick', 'Plantagenet Cherokee', 'Playbill', 'PMingLiU', 'PMingLiU-ExtB', 'Poor Richard', 'Poster', 'PosterBodoni BT', 'PRINCETOWN LET', 'Pristina', 'PTBarnum BT', 'Pythagoras', 'Raavi', 'Rage Italic', 'Ravie', 'Ribbon131 Bd BT', 'Rockwell', 'Rockwell Condensed', 'Rockwell Extra Bold', 'Rod', 'Roman', 'Sakkal Majalla', 'Santa Fe LET', 'Savoye LET', 'Sceptre', 'Script', 'Script MT Bold', 'SCRIPTINA', 'Serifa', 'Serifa BT', 'Serifa Th BT', 'ShelleyVolante BT', 'Sherwood', 'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'Signboard', 'SILKSCREEN', 'SimHei', 'Simplified Arabic', 'Simplified Arabic Fixed', 'SimSun', 'SimSun-ExtB', 'Sinhala Sangam MN', 'Sketch Rockwell', 'Skia', 'Small Fonts', 'Snap ITC', 'Snell Roundhand', 'Socket', 'Souvenir Lt BT', 'Staccato222 BT', 'Steamer', 'Stencil', 'Storybook', 'Styllo', 'Subway', 'Swis721 BlkEx BT', 'Swiss911 XCm BT', 'Sylfaen', 'Synchro LET', 'System', 'Tamil Sangam MN', 'Technical', 'Teletype', 'Telugu Sangam MN', 'Tempus Sans ITC', 'Terminal', 'Thonburi', 'Traditional Arabic', 'Trajan', 'TRAJAN PRO', 'Tristan', 'Tubular', 'Tunga', 'Tw Cen MT', 'Tw Cen MT Condensed', 'Tw Cen MT Condensed Extra Bold', 'TypoUpright BT', 'Unicorn', 'Univers', 'Univers CE 55 Medium', 'Univers Condensed', 'Utsaah', 'Vagabond', 'Vani', 'Vijaya', 'Viner Hand ITC', 'VisualUI', 'Vivaldi', 'Vladimir Script', 'Vrinda', 'Westminster', 'WHITNEY', 'Wide Latin', 'ZapfEllipt BT', 'ZapfHumnst BT', 'ZapfHumnst Dm BT', 'Zapfino', 'Zurich BlkEx BT', 'Zurich Ex BT', 'ZWAdobeF']
                if (that.options.extendedJsFonts) {
                    fontList = fontList.concat(extendedFontList)
                }
                fontList = fontList.concat(that.options.userDefinedFonts)
                fontList = fontList.filter(function (font, position) {
                    return fontList.indexOf(font) === position
                })
                var testString = 'mmmmmmmmmmlli'
                var testSize = '72px'
                var h = document.getElementsByTagName('body')[0]
                var baseFontsDiv = document.createElement('div')
                var fontsDiv = document.createElement('div')
                var defaultWidth = {}
                var defaultHeight = {}
                var createSpan = function () {
                    var s = document.createElement('span')
                    s.style.position = 'absolute'
                    s.style.left = '-9999px'
                    s.style.fontSize = testSize
                    s.style.fontStyle = 'normal'
                    s.style.fontWeight = 'normal'
                    s.style.letterSpacing = 'normal'
                    s.style.lineBreak = 'auto'
                    s.style.lineHeight = 'normal'
                    s.style.textTransform = 'none'
                    s.style.textAlign = 'left'
                    s.style.textDecoration = 'none'
                    s.style.textShadow = 'none'
                    s.style.whiteSpace = 'normal'
                    s.style.wordBreak = 'normal'
                    s.style.wordSpacing = 'normal'
                    s.innerHTML = testString
                    return s
                }
                var createSpanWithFonts = function (fontToDetect, baseFont) {
                    var s = createSpan()
                    s.style.fontFamily = "'" + fontToDetect + "'," + baseFont
                    return s
                }
                var initializeBaseFontsSpans = function () {
                    var spans = []
                    for (var index = 0, length = baseFonts.length; index < length; index++) {
                        var s = createSpan()
                        s.style.fontFamily = baseFonts[index]
                        baseFontsDiv.appendChild(s)
                        spans.push(s)
                    }
                    return spans
                }
                var initializeFontsSpans = function () {
                    var spans = {}
                    for (var i = 0, l = fontList.length; i < l; i++) {
                        var fontSpans = []
                        for (var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                            var s = createSpanWithFonts(fontList[i], baseFonts[j])
                            fontsDiv.appendChild(s)
                            fontSpans.push(s)
                        }
                        spans[fontList[i]] = fontSpans
                    }
                    return spans
                }
                var isFontAvailable = function (fontSpans) {
                    var detected = false
                    for (var i = 0; i < baseFonts.length; i++) {
                        detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]])
                        if (detected) {
                            return detected
                        }
                    }
                    return detected
                }
                var baseFontsSpans = initializeBaseFontsSpans()
                h.appendChild(baseFontsDiv)
                for (var index = 0, length = baseFonts.length; index < length; index++) {
                    defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth
                    defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight
                }
                var fontsSpans = initializeFontsSpans()
                h.appendChild(fontsDiv)
                var available = []
                for (var i = 0, l = fontList.length; i < l; i++) {
                    if (isFontAvailable(fontsSpans[fontList[i]])) {
                        available.push(fontList[i])
                    }
                }
                h.removeChild(fontsDiv)
                h.removeChild(baseFontsDiv)
                keys.addPreprocessedComponent({key: 'js_fonts', value: available})
                done(keys)
            }, 1)
        }, pluginsKey: function (keys) {
            if (!this.options.excludePlugins) {
                if (this.isIE()) {
                    if (!this.options.excludeIEPlugins) {
                        keys.addPreprocessedComponent({key: 'ie_plugins', value: this.getIEPlugins()})
                    }
                } else {
                    keys.addPreprocessedComponent({key: 'regular_plugins', value: this.getRegularPlugins()})
                }
            }
            return keys
        }, getRegularPlugins: function () {
            var plugins = []
            if (navigator.plugins) {
                for (var i = 0, l = navigator.plugins.length; i < l; i++) {
                    if (navigator.plugins[i]) {
                        plugins.push(navigator.plugins[i])
                    }
                }
            }
            if (this.pluginsShouldBeSorted()) {
                plugins = plugins.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1
                    }
                    if (a.name < b.name) {
                        return -1
                    }
                    return 0
                })
            }
            return this.map(plugins, function (p) {
                var mimeTypes = this.map(p, function (mt) {
                    return [mt.type, mt.suffixes].join('~')
                }).join(',')
                return [p.name, p.description, mimeTypes].join('::')
            }, this)
        }, getIEPlugins: function () {
            var result = []
            if ((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window)) {
                var names = ['AcroPDF.PDF', 'Adodb.Stream', 'AgControl.AgControl', 'DevalVRXCtrl.DevalVRXCtrl.1', 'MacromediaFlashPaper.MacromediaFlashPaper', 'Msxml2.DOMDocument', 'Msxml2.XMLHTTP', 'PDF.PdfCtrl', 'QuickTime.QuickTime', 'QuickTimeCheckObject.QuickTimeCheck.1', 'RealPlayer', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)', 'Scripting.Dictionary', 'SWCtl.SWCtl', 'Shell.UIHelper', 'ShockwaveFlash.ShockwaveFlash', 'Skype.Detection', 'TDCCtl.TDCCtl', 'WMPlayer.OCX', 'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1']
                result = this.map(names, function (name) {
                    try {
                        new window.ActiveXObject(name)
                        return name
                    } catch (e) {
                        return null
                    }
                })
            }
            if (navigator.plugins) {
                result = result.concat(this.getRegularPlugins())
            }
            return result
        }, pluginsShouldBeSorted: function () {
            var should = false
            for (var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
                var re = this.options.sortPluginsFor[i]
                if (navigator.userAgent.match(re)) {
                    should = true
                    break
                }
            }
            return should
        }, touchSupportKey: function (keys) {
            if (!this.options.excludeTouchSupport) {
                keys.addPreprocessedComponent({key: 'touch_support', value: this.getTouchSupport()})
            }
            return keys
        }, hardwareConcurrencyKey: function (keys) {
            if (!this.options.excludeHardwareConcurrency) {
                keys.addPreprocessedComponent({key: 'hardware_concurrency', value: this.getHardwareConcurrency()})
            }
            return keys
        }, hasSessionStorage: function () {
            try {
                return !!window.sessionStorage
            } catch (e) {
                return true
            }
        }, hasLocalStorage: function () {
            try {
                return !!window.localStorage
            } catch (e) {
                return true
            }
        }, hasIndexedDB: function () {
            try {
                return !!window.indexedDB
            } catch (e) {
                return true
            }
        }, getHardwareConcurrency: function () {
            if (navigator.hardwareConcurrency) {
                return navigator.hardwareConcurrency
            }
            return 'unknown'
        }, getNavigatorCpuClass: function () {
            if (navigator.cpuClass) {
                return navigator.cpuClass
            } else {
                return 'unknown'
            }
        }, getNavigatorPlatform: function () {
            if (navigator.platform) {
                return navigator.platform
            } else {
                return 'unknown'
            }
        }, getDoNotTrack: function () {
            if (navigator.doNotTrack) {
                return navigator.doNotTrack
            } else if (navigator.msDoNotTrack) {
                return navigator.msDoNotTrack
            } else if (window.doNotTrack) {
                return window.doNotTrack
            } else {
                return 'unknown'
            }
        }, getTouchSupport: function () {
            var maxTouchPoints = 0
            var touchEvent = false
            if (typeof navigator.maxTouchPoints !== 'undefined') {
                maxTouchPoints = navigator.maxTouchPoints
            } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
                maxTouchPoints = navigator.msMaxTouchPoints
            }
            try {
                document.createEvent('TouchEvent')
                touchEvent = true
            } catch (_) {
            }
            var touchStart = 'ontouchstart' in window
            return [maxTouchPoints, touchEvent, touchStart]
        }, getCanvasFp: function () {
            var result = []
            var canvas = document.createElement('canvas')
            canvas.width = 2000
            canvas.height = 200
            canvas.style.display = 'inline'
            var ctx = canvas.getContext('2d')
            ctx.rect(0, 0, 10, 10)
            ctx.rect(2, 2, 6, 6)
            result.push('canvas winding:' + ((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'))
            ctx.textBaseline = 'alphabetic'
            ctx.fillStyle = '#f60'
            ctx.fillRect(125, 1, 62, 20)
            ctx.fillStyle = '#069'
            if (this.options.dontUseFakeFontInCanvas) {
                ctx.font = '11pt Arial'
            } else {
                ctx.font = '11pt no-real-font-123'
            }
            ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15)
            ctx.fillStyle = 'rgba(102, 204, 0, 0.2)'
            ctx.font = '18pt Arial'
            ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45)
            ctx.globalCompositeOperation = 'multiply'
            ctx.fillStyle = 'rgb(255,0,255)'
            ctx.beginPath()
            ctx.arc(50, 50, 50, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = 'rgb(0,255,255)'
            ctx.beginPath()
            ctx.arc(100, 50, 50, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = 'rgb(255,255,0)'
            ctx.beginPath()
            ctx.arc(75, 100, 50, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fill()
            ctx.fillStyle = 'rgb(255,0,255)'
            ctx.arc(75, 75, 75, 0, Math.PI * 2, true)
            ctx.arc(75, 75, 25, 0, Math.PI * 2, true)
            ctx.fill('evenodd')
            if (canvas.toDataURL) {
                result.push('canvas fp:' + canvas.toDataURL())
            }
            return result.join('~')
        }, getWebglFp: function () {
            var gl
            var fa2s = function (fa) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0)
                gl.enable(gl.DEPTH_TEST)
                gl.depthFunc(gl.LEQUAL)
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
                return '[' + fa[0] + ', ' + fa[1] + ']'
            }
            var maxAnisotropy = function (gl) {
                var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic')
                if (ext) {
                    var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
                    if (anisotropy === 0) {
                        anisotropy = 2
                    }
                    return anisotropy
                } else {
                    return null
                }
            }
            gl = this.getWebglCanvas()
            if (!gl) {
                return null
            }
            var result = []
            var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}'
            var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}'
            var vertexPosBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
            var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0])
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            vertexPosBuffer.itemSize = 3
            vertexPosBuffer.numItems = 3
            var program = gl.createProgram()
            var vshader = gl.createShader(gl.VERTEX_SHADER)
            gl.shaderSource(vshader, vShaderTemplate)
            gl.compileShader(vshader)
            var fshader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(fshader, fShaderTemplate)
            gl.compileShader(fshader)
            gl.attachShader(program, vshader)
            gl.attachShader(program, fshader)
            gl.linkProgram(program)
            gl.useProgram(program)
            program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex')
            program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset')
            gl.enableVertexAttribArray(program.vertexPosArray)
            gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0)
            gl.uniform2f(program.offsetUniform, 1, 1)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
            try {
                result.push(gl.canvas.toDataURL())
            } catch (e) {
            }
            result.push('extensions:' + (gl.getSupportedExtensions() || []).join(';'))
            result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)))
            result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)))
            result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS))
            result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'))
            result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS))
            result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS))
            result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS))
            result.push('webgl max anisotropy:' + maxAnisotropy(gl))
            result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS))
            result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE))
            result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS))
            result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))
            result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS))
            result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE))
            result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS))
            result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS))
            result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS))
            result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS))
            result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)))
            result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS))
            result.push('webgl renderer:' + gl.getParameter(gl.RENDERER))
            result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION))
            result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS))
            result.push('webgl vendor:' + gl.getParameter(gl.VENDOR))
            result.push('webgl version:' + gl.getParameter(gl.VERSION))
            try {
                var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
                if (extensionDebugRendererInfo) {
                    result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL))
                    result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL))
                }
            } catch (e) {
            }
            if (!gl.getShaderPrecisionFormat) {
                return result.join('~')
            }
            result.push('webgl vertex shader high float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision)
            result.push('webgl vertex shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin)
            result.push('webgl vertex shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax)
            result.push('webgl vertex shader medium float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision)
            result.push('webgl vertex shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin)
            result.push('webgl vertex shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax)
            result.push('webgl vertex shader low float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision)
            result.push('webgl vertex shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin)
            result.push('webgl vertex shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax)
            result.push('webgl fragment shader high float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision)
            result.push('webgl fragment shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin)
            result.push('webgl fragment shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax)
            result.push('webgl fragment shader medium float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision)
            result.push('webgl fragment shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin)
            result.push('webgl fragment shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax)
            result.push('webgl fragment shader low float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision)
            result.push('webgl fragment shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin)
            result.push('webgl fragment shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax)
            result.push('webgl vertex shader high int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision)
            result.push('webgl vertex shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin)
            result.push('webgl vertex shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax)
            result.push('webgl vertex shader medium int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision)
            result.push('webgl vertex shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin)
            result.push('webgl vertex shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax)
            result.push('webgl vertex shader low int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision)
            result.push('webgl vertex shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin)
            result.push('webgl vertex shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax)
            result.push('webgl fragment shader high int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision)
            result.push('webgl fragment shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin)
            result.push('webgl fragment shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax)
            result.push('webgl fragment shader medium int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision)
            result.push('webgl fragment shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin)
            result.push('webgl fragment shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax)
            result.push('webgl fragment shader low int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision)
            result.push('webgl fragment shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin)
            result.push('webgl fragment shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax)
            return result.join('~')
        }, getWebglVendorAndRenderer: function () {
            try {
                var glContext = this.getWebglCanvas()
                var extensionDebugRendererInfo = glContext.getExtension('WEBGL_debug_renderer_info')
                return glContext.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL) + '~' + glContext.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
            } catch (e) {
                return null
            }
        }, getAdBlock: function () {
            var ads = document.createElement('div')
            ads.innerHTML = '&nbsp;'
            ads.className = 'adsbox'
            var result = false
            try {
                document.body.appendChild(ads)
                result = document.getElementsByClassName('adsbox')[0].offsetHeight === 0
                document.body.removeChild(ads)
            } catch (e) {
                result = false
            }
            return result
        }, getHasLiedLanguages: function () {
            if (typeof navigator.languages !== 'undefined') {
                try {
                    var firstLanguages = navigator.languages[0].substr(0, 2)
                    if (firstLanguages !== navigator.language.substr(0, 2)) {
                        return true
                    }
                } catch (err) {
                    return true
                }
            }
            return false
        }, getHasLiedResolution: function () {
            if (window.screen.width < window.screen.availWidth) {
                return true
            }
            if (window.screen.height < window.screen.availHeight) {
                return true
            }
            return false
        }, getHasLiedOs: function () {
            var userAgent = navigator.userAgent.toLowerCase()
            var oscpu = navigator.oscpu
            var platform = navigator.platform.toLowerCase()
            var os
            if (userAgent.indexOf('windows phone') >= 0) {
                os = 'Windows Phone'
            } else if (userAgent.indexOf('win') >= 0) {
                os = 'Windows'
            } else if (userAgent.indexOf('android') >= 0) {
                os = 'Android'
            } else if (userAgent.indexOf('linux') >= 0) {
                os = 'Linux'
            } else if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0) {
                os = 'iOS'
            } else if (userAgent.indexOf('mac') >= 0) {
                os = 'Mac'
            } else {
                os = 'Other'
            }
            var mobileDevice
            if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
                mobileDevice = true
            } else {
                mobileDevice = false
            }
            if (mobileDevice && os !== 'Windows Phone' && os !== 'Android' && os !== 'iOS' && os !== 'Other') {
                return true
            }
            if (typeof oscpu !== 'undefined') {
                oscpu = oscpu.toLowerCase()
                if (oscpu.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
                    return true
                } else if (oscpu.indexOf('linux') >= 0 && os !== 'Linux' && os !== 'Android') {
                    return true
                } else if (oscpu.indexOf('mac') >= 0 && os !== 'Mac' && os !== 'iOS') {
                    return true
                } else if ((oscpu.indexOf('win') === -1 && oscpu.indexOf('linux') === -1 && oscpu.indexOf('mac') === -1) !== (os === 'Other')) {
                    return true
                }
            }
            if (platform.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
                return true
            } else if ((platform.indexOf('linux') >= 0 || platform.indexOf('android') >= 0 || platform.indexOf('pike') >= 0) && os !== 'Linux' && os !== 'Android') {
                return true
            } else if ((platform.indexOf('mac') >= 0 || platform.indexOf('ipad') >= 0 || platform.indexOf('ipod') >= 0 || platform.indexOf('iphone') >= 0) && os !== 'Mac' && os !== 'iOS') {
                return true
            } else if ((platform.indexOf('win') === -1 && platform.indexOf('linux') === -1 && platform.indexOf('mac') === -1) !== (os === 'Other')) {
                return true
            }
            if (typeof navigator.plugins === 'undefined' && os !== 'Windows' && os !== 'Windows Phone') {
                return true
            }
            return false
        }, getHasLiedBrowser: function () {
            var userAgent = navigator.userAgent.toLowerCase()
            var productSub = navigator.productSub
            var browser
            if (userAgent.indexOf('firefox') >= 0) {
                browser = 'Firefox'
            } else if (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0) {
                browser = 'Opera'
            } else if (userAgent.indexOf('chrome') >= 0) {
                browser = 'Chrome'
            } else if (userAgent.indexOf('safari') >= 0) {
                browser = 'Safari'
            } else if (userAgent.indexOf('trident') >= 0) {
                browser = 'Internet Explorer'
            } else {
                browser = 'Other'
            }
            if ((browser === 'Chrome' || browser === 'Safari' || browser === 'Opera') && productSub !== '20030107') {
                return true
            }
            var tempRes = eval.toString().length
            if (tempRes === 37 && browser !== 'Safari' && browser !== 'Firefox' && browser !== 'Other') {
                return true
            } else if (tempRes === 39 && browser !== 'Internet Explorer' && browser !== 'Other') {
                return true
            } else if (tempRes === 33 && browser !== 'Chrome' && browser !== 'Opera' && browser !== 'Other') {
                return true
            }
            var errFirefox
            try {
                throw'a'
            } catch (err) {
                try {
                    err.toSource()
                    errFirefox = true
                } catch (errOfErr) {
                    errFirefox = false
                }
            }
            if (errFirefox && browser !== 'Firefox' && browser !== 'Other') {
                return true
            }
            return false
        }, isCanvasSupported: function () {
            var elem = document.createElement('canvas')
            return !!(elem.getContext && elem.getContext('2d'))
        }, isWebGlSupported: function () {
            if (!this.isCanvasSupported()) {
                return false
            }
            var glContext = this.getWebglCanvas()
            return !!window.WebGLRenderingContext && !!glContext
        }, isIE: function () {
            if (navigator.appName === 'Microsoft Internet Explorer') {
                return true
            } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {
                return true
            }
            return false
        }, hasSwfObjectLoaded: function () {
            return typeof window.swfobject !== 'undefined'
        }, hasMinFlashInstalled: function () {
            return window.swfobject.hasFlashPlayerVersion('9.0.0')
        }, addFlashDivNode: function () {
            var node = document.createElement('div')
            node.setAttribute('id', this.options.swfContainerId)
            document.body.appendChild(node)
        }, loadSwfAndDetectFonts: function (done) {
            var hiddenCallback = '___fp_swf_loaded'
            window[hiddenCallback] = function (fonts) {
                done(fonts)
            }
            var id = this.options.swfContainerId
            this.addFlashDivNode()
            var flashvars = {onReady: hiddenCallback}
            var flashparams = {allowScriptAccess: 'always', menu: 'false'}
            window.swfobject.embedSWF(this.options.swfPath, id, '1', '1', '9.0.0', false, flashvars, flashparams, {})
        }, getWebglCanvas: function () {
            var canvas = document.createElement('canvas')
            var gl = null
            try {
                gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            } catch (e) {
            }
            if (!gl) {
                gl = null
            }
            return gl
        }, each: function (obj, iterator, context) {
            if (obj === null) {
                return
            }
            if (this.nativeForEach && obj.forEach === this.nativeForEach) {
                obj.forEach(iterator, context)
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) {
                        return
                    }
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) {
                            return
                        }
                    }
                }
            }
        }, map: function (obj, iterator, context) {
            var results = []
            if (obj == null) {
                return results
            }
            if (this.nativeMap && obj.map === this.nativeMap) {
                return obj.map(iterator, context)
            }
            this.each(obj, function (value, index, list) {
                results[results.length] = iterator.call(context, value, index, list)
            })
            return results
        }, x64Add: function (m, n) {
            m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
            n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
            var o = [0, 0, 0, 0]
            o[3] += m[3] + n[3]
            o[2] += o[3] >>> 16
            o[3] &= 0xffff
            o[2] += m[2] + n[2]
            o[1] += o[2] >>> 16
            o[2] &= 0xffff
            o[1] += m[1] + n[1]
            o[0] += o[1] >>> 16
            o[1] &= 0xffff
            o[0] += m[0] + n[0]
            o[0] &= 0xffff
            return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
        }, x64Multiply: function (m, n) {
            m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
            n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
            var o = [0, 0, 0, 0]
            o[3] += m[3] * n[3]
            o[2] += o[3] >>> 16
            o[3] &= 0xffff
            o[2] += m[2] * n[3]
            o[1] += o[2] >>> 16
            o[2] &= 0xffff
            o[2] += m[3] * n[2]
            o[1] += o[2] >>> 16
            o[2] &= 0xffff
            o[1] += m[1] * n[3]
            o[0] += o[1] >>> 16
            o[1] &= 0xffff
            o[1] += m[2] * n[2]
            o[0] += o[1] >>> 16
            o[1] &= 0xffff
            o[1] += m[3] * n[1]
            o[0] += o[1] >>> 16
            o[1] &= 0xffff
            o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0])
            o[0] &= 0xffff
            return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
        }, x64Rotl: function (m, n) {
            n %= 64
            if (n === 32) {
                return [m[1], m[0]]
            } else if (n < 32) {
                return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))]
            } else {
                n -= 32
                return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))]
            }
        }, x64LeftShift: function (m, n) {
            n %= 64
            if (n === 0) {
                return m
            } else if (n < 32) {
                return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n]
            } else {
                return [m[1] << (n - 32), 0]
            }
        }, x64Xor: function (m, n) {
            return [m[0] ^ n[0], m[1] ^ n[1]]
        }, x64Fmix: function (h) {
            h = this.x64Xor(h, [0, h[0] >>> 1])
            h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd])
            h = this.x64Xor(h, [0, h[0] >>> 1])
            h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53])
            h = this.x64Xor(h, [0, h[0] >>> 1])
            return h
        }, x64hash128: function (key, seed) {
            key = key || ''
            seed = seed || 0
            var remainder = key.length % 16
            var bytes = key.length - remainder
            var h1 = [0, seed]
            var h2 = [0, seed]
            var k1 = [0, 0]
            var k2 = [0, 0]
            var c1 = [0x87c37b91, 0x114253d5]
            var c2 = [0x4cf5ad43, 0x2745937f]
            for (var i = 0; i < bytes; i = i + 16) {
                k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)]
                k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)]
                k1 = this.x64Multiply(k1, c1)
                k1 = this.x64Rotl(k1, 31)
                k1 = this.x64Multiply(k1, c2)
                h1 = this.x64Xor(h1, k1)
                h1 = this.x64Rotl(h1, 27)
                h1 = this.x64Add(h1, h2)
                h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729])
                k2 = this.x64Multiply(k2, c2)
                k2 = this.x64Rotl(k2, 33)
                k2 = this.x64Multiply(k2, c1)
                h2 = this.x64Xor(h2, k2)
                h2 = this.x64Rotl(h2, 31)
                h2 = this.x64Add(h2, h1)
                h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
            }
            k1 = [0, 0]
            k2 = [0, 0]
            switch (remainder) {
                case 15:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48))
                case 14:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40))
                case 13:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32))
                case 12:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24))
                case 11:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16))
                case 10:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8))
                case 9:
                    k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)])
                    k2 = this.x64Multiply(k2, c2)
                    k2 = this.x64Rotl(k2, 33)
                    k2 = this.x64Multiply(k2, c1)
                    h2 = this.x64Xor(h2, k2)
                case 8:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56))
                case 7:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48))
                case 6:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40))
                case 5:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32))
                case 4:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24))
                case 3:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16))
                case 2:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8))
                case 1:
                    k1 = this.x64Xor(k1, [0, key.charCodeAt(i)])
                    k1 = this.x64Multiply(k1, c1)
                    k1 = this.x64Rotl(k1, 31)
                    k1 = this.x64Multiply(k1, c2)
                    h1 = this.x64Xor(h1, k1)
            }
            h1 = this.x64Xor(h1, [0, key.length])
            h2 = this.x64Xor(h2, [0, key.length])
            h1 = this.x64Add(h1, h2)
            h2 = this.x64Add(h2, h1)
            h1 = this.x64Fmix(h1)
            h2 = this.x64Fmix(h2)
            h1 = this.x64Add(h1, h2)
            h2 = this.x64Add(h2, h1)
            return ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8)
        }
    }
    Fingerprint2.VERSION = '1.8.0'
    return Fingerprint2
})