
function enableCopy() {
    // ==UserScript==
    // @name          Absolute Enable Right Click & Copy
    // @namespace     Absolute Right Click
    // @description   Force Enable Right Click & Copy & Highlight
    // @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
    // @author        Absolute
    // @version       1.8.9
    // @include       *://*
    // @icon          https://i.imgur.com/AC7SyUr.png
    // @compatible    Chrome Google Chrome + Tampermonkey
    // @grant         GM_registerMenuCommand
    // @license       BSD
    // @copyright     Absolute, 2016-Oct-06
    // ==/UserScript==
    (function () {
        'use strict';

        var css = document.createElement('style');
        var head = document.head;

        css.type = 'text/css';

        css.innerText = `* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
         user-select: text !important;
    }`;

        function main() {

            var doc = document;
            var body = document.body;

            var docEvents = [
                doc.oncontextmenu = null,
                doc.onselectstart = null,
                doc.ondragstart = null,
                doc.onmousedown = null
            ];

            var bodyEvents = [
                body.oncontextmenu = null,
                body.onselectstart = null,
                body.ondragstart = null,
                body.onmousedown = null,
                body.oncut = null,
                body.oncopy = null,
                body.onpaste = null
            ];

            [].forEach.call(
                ['copy', 'cut', 'paste', 'select', 'selectstart'],
                function (event) {
                    document.addEventListener(event, function (e) { e.stopPropagation(); }, true);
                }
            );

            alwaysAbsoluteMode();
            enableCommandMenu();
            head.appendChild(css);
            document.addEventListener('keydown', keyPress);
        }

        function keyPress(event) {
            if (event.ctrlKey && event.keyCode == 192) {
                return confirm('Activate Absolute Right Click Mode!') == true ? absoluteMode() : null;
            }
        }

        function absoluteMode() {
            [].forEach.call(
                ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'],
                function (event) {
                    document.addEventListener(event, function (e) { e.stopPropagation(); }, true);
                }
            );
        }

        function alwaysAbsoluteMode() {
            let sites = ['example.com', 'www.example.com'];
            const list = RegExp(sites.join('|')).exec(location.hostname);
            return list ? absoluteMode() : null;
        }

        function enableCommandMenu() {
            var commandMenu = true;
            try {
                if (typeof (GM_registerMenuCommand) == "undefined") {
                    return;
                } else {
                    if (commandMenu == true) {
                        GM_registerMenuCommand('Enable Absolute Right Click Mode', function () {
                            return confirm('Activate Absolute Right Click Mode!') == true ? absoluteMode() : null;
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        var blackList = [
            'youtube.com', '.google.', '.google.com', 'greasyfork.org', 'twitter.com', 'instagram.com', 'facebook.com', 'translate.google.com', '.amazon.', '.ebay.', 'github.', 'stackoverflow.com',
            'bing.com', 'live.com', '.microsoft.com', 'dropbox.com', 'pcloud.com', 'box.com', 'sync.com', 'onedrive.com', 'mail.ru', 'deviantart.com', 'pastebin.com',
            'dailymotion.com', 'twitch.tv', 'spotify.com', 'steam.com', 'steampowered.com', 'gitlab.com', '.reddit.com'
        ]

        var enabled = false;
        var url = window.location.hostname;
        var match = RegExp(blackList.join('|')).exec(url);

        if (window && typeof window != undefined && head != undefined) {

            if (!match && enabled != true) {

                main();
                enabled = true

                //console.log(location.hostname);

                window.addEventListener('contextmenu', function contextmenu(event) {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    var handler = new eventHandler(event);
                    window.removeEventListener(event.type, contextmenu, true);
                    var eventsCallBack = new eventsCall(function () { });
                    handler.fire();
                    window.addEventListener(event.type, contextmenu, true);
                    if (handler.isCanceled && (eventsCallBack.isCalled)) {
                        event.preventDefault();
                    }
                }, true);
            }

            function eventsCall() {
                this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
                this.bind();
            }

            eventsCall.prototype.bind = function () {
                this.events.forEach(function (event) {
                    document.addEventListener(event, this, true);
                }.bind(this));
            };

            eventsCall.prototype.handleEvent = function () {
                this.isCalled = true;
            };

            eventsCall.prototype.unbind = function () {
                this.events.forEach(function (event) { }.bind(this));
            };

            function eventHandler(event) {
                this.event = event;
                this.contextmenuEvent = this.createEvent(this.event.type);
            }

            eventHandler.prototype.createEvent = function (type) {
                var target = this.event.target;
                var event = target.ownerDocument.createEvent('MouseEvents');
                event.initMouseEvent(
                    type, this.event.bubbles, this.event.cancelable,
                    target.ownerDocument.defaultView, this.event.detail,
                    this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
                    this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
                    this.event.button, this.event.relatedTarget
                );
                return event;
            };

            eventHandler.prototype.fire = function () {
                var target = this.event.target;
                var contextmenuHandler = function (event) {
                    event.preventDefault();
                }.bind(this);
                target.dispatchEvent(this.contextmenuEvent);
                this.isCanceled = this.contextmenuEvent.defaultPrevented;
            };

        }

    })();
}

function adFilter(name) {
    let ad = document.querySelectorAll(name);
    ad.forEach(function (e) {
        if ((e.nodeName == 'SCRIPT') && (e.innerText.indexOf("_ad") < 0)) {
            return;
        }
        e.parentNode.removeChild(e);
    });

    // ad = Array.from(ad);
    // ad.filter(function (v) { v.style.display = 'none'; })

    if (ad.length > 0) {
        console.log("adFilter --> ", name);
    }
}

function loadGlobal(jsfilename) {
    // because of  "isolated world" 
    // ref: https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(jsfilename);
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    console.log('loadGlobal --> ', jsfilename);
}

// div#aaa 遍历id为aaa的div标签
// div.xxx 遍历div下 class为xxx的标签
// div[aaa="bbb"] 遍历div下存在aaa="bbb"这个属性的标签

var allRules = [];

allRules = allRules.concat(['div#HMcoupletDivleft', 'div#HMRichBox', 'div#HMcoupletDivright', 'div.tuiguang', 'div#adv_wrap_hh1', 'div.hh-ani-left']);
allRules = allRules.concat(['div#ad_unit', 'div#first-ad', 'div.my-4', 'div#second-ad', 'div.google-ad', 'ins.adsbygoogle', 'div#ad_t2']);
allRules = allRules.concat(['div#cnblogs_c1', 'div#cnblogs_c2', 'div#csdn-shop-window-top', 'div#csdn-shop-window', 'div#downdiv', 'div#fix_bottom_dom']);
allRules = allRules.concat(['[style="position:relative;z-index:2147483647;"]', '[style="flex:1; position: relative; z-index:2147483647!important;margin:0;"]']);
allRules = allRules.concat(['div.topAA', "[onclick=\"window.location.href='/api/goapp/'\"]"]);


// 拦截恶意标签
function adFilterTimerFunc() {
    console.log('adFilterTimerFunc');

    console.log()
    setTimeout(function () {
        for (name of allRules) {
            // console.log(name);
            try {
                adFilter(name);
            } catch (error) {
                console.log(error);
                continue;
            }
        }
    }, 3000);
}

adFilterTimerFunc();
enableCopy();

loadGlobal('pwnlib.js');
