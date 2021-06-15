

// 拦截恶意的js文件
allRules = []

allRules = allRules.concat(["*://*/*yfgg.js","*://*/*yfyh.js","*://*/*pc_pf.js"]);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { redirectUrl: chrome.extension.getURL("hook.js") };
    },
    {
        urls: allRules  //你要拦截的url地址
    },
    ["blocking"] //类型blocking为拦截,
);
