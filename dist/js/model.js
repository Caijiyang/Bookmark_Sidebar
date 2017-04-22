/*! (c) Philipp König under GPL-3.0 */
"use strict";!function(){var a=null,b={},c=[],d={updateUrls:"https://moonware.de/ajax/extensions/updateUrls",userdata:"https://moonware.de/ajax/extensions/userdata"},e={get:function(a,b){chrome.bookmarks.get(""+a,b)},getSubTree:function(a,b){chrome.bookmarks.getSubTree(""+a,b)},removeTree:function(a,b){chrome.bookmarks.removeTree(""+a,b)},update:function(a,b,c){chrome.bookmarks.update(""+a,b,c)},move:function(a,b,c){chrome.bookmarks.move(""+a,b,c)},search:function(a,b){chrome.bookmarks.search(a,b)}},f=function(a){a.id&&(void 0===b.clickCounter[a.id]&&(void 0===b.clickCounter["node_"+a.id]?b.clickCounter[a.id]=0:b.clickCounter[a.id]=b.clickCounter["node_"+a.id]),b.clickCounter[a.id]++,delete b.clickCounter["node_"+a.id],u())},g=function(a,c){f(a),a.newTab&&!0===a.newTab?chrome.tabs.query({active:!0,currentWindow:!0},function(c){chrome.tabs.create({url:a.href,active:void 0===a.active||!!a.active,index:c[0].index+1,openerTabId:c[0].id},function(a){b.openedByExtension=a.id,u()})}):a.incognito&&!0===a.incognito?chrome.windows.create({url:a.href,state:"maximized",incognito:!0}):chrome.tabs.query({active:!0,currentWindow:!0},function(c){chrome.tabs.update(c[0].id,{url:a.href},function(a){b.openedByExtension=a.id,u()})})},h=function(a,b){var c=new Image;c.onload=function(){var a=document.createElement("canvas");a.width=this.width,a.height=this.height,a.getContext("2d").drawImage(this,0,0);var c=a.toDataURL("image/png");b({img:c})},c.src="chrome://favicon/size/16@2x/"+a.url},i=function(a,c){c({views:b.clickCounter[a.id]||b.clickCounter["node_"+a.id]||0,counterStartDate:b.installationDate})},j=function(a,b){e.getSubTree(a.id,function(a){b({bookmarks:a})})},k=function(a,b){e.search(a.searchVal,function(a){b({bookmarks:a})})},l=function(a,c){void 0===b.openedByExtension&&e.search({url:a.url},function(b){b.some(function(b){return b.url===a.url&&(f(b),!0)})}),delete b.openedByExtension,u()},m=function(a,b){var c={parentId:""+a.parentId,index:a.index};e.move(a.id,c,function(){b({moved:a.id})})},n=function(a,b){var c={title:a.title};a.url&&(c.url=a.url),e.update(a.id,c,function(){b({updated:a.id})})},o=function(a,b){e.removeTree(a.id,function(){b({deleted:a.id})})},p=function(a,b){if(a.abort&&!0===a.abort)c.forEach(function(a){a.abort()});else{var e=new XMLHttpRequest;e.open("POST",d.updateUrls,!0),e.onload=function(){var a=JSON.parse(e.responseText);b(a)};var f=new FormData;f.append("url",a.url),f.append("ua",navigator.userAgent),f.append("lang",chrome.i18n.getUILanguage()),e.send(f),c.push(e)}},q=function(c,d){var e=!1;null===a&&(+new Date-b.installationDate)/864e5>5&&(e=!0),d({showMask:e})},r=function(c,d){chrome.storage.sync.set({shareUserdata:c.share}),a=c.share,b.lastShareDate=0,u()},s=function(a,c){e.getSubTree(a.id,function(a){var d=0,e={bookmarks:0,dirs:0,total:0};a[0]&&a[0].children&&a[0].children.length>0&&function a(c){c.forEach(function(c){e.total++,c.children?e.dirs++:(e.bookmarks++,b.clickCounter[c.id]?d+=b.clickCounter[c.id]:b.clickCounter["node_"+c.id]&&(d+=b.clickCounter["node_"+c.id])),c.children&&c.children.length>0&&a(c.children)})}(a[0].children),c({childrenAmount:e,clickAmount:d,counterStartDate:b.installationDate})})},t={realUrl:p,addViewAmount:l,dirInfos:s,bookmarks:j,searchBookmarks:k,moveBookmark:m,updateBookmark:n,deleteBookmark:o,shareUserdata:r,shareUserdataMask:q,favicon:h,openLink:g,viewAmount:i};chrome.extension.onMessage.addListener(function(a,b,c){return t[a.type]&&t[a.type](a,c),!0}),chrome.browserAction.onClicked.addListener(function(){chrome.tabs.query({active:!0,currentWindow:!0},function(a){chrome.tabs.sendMessage(a[0].id,{action:"toggleSidebar"})})}),chrome.runtime.onInstalled.addListener(function(a){if("install"===a.reason)chrome.tabs.create({url:chrome.extension.getURL("html/howto.html")});else if("update"===a.reason){var c=chrome.runtime.getManifest().version,d=a.previousVersion.split("."),e=c.split(".");d[0]===e[0]&&d[1]===e[1]||(chrome.storage.sync.get(["model"],function(a){void 0===a.model||void 0!==a.model.updateNotification&&a.model.updateNotification===c||(b.updateNotification=c,u(function(){chrome.tabs.create({url:chrome.extension.getURL("html/changelog.html")})}))}),chrome.storage.sync.get(null,function(a){if(a.behaviour&&(void 0===a.behaviour.rememberState&&void 0!==a.behaviour.rememberScroll&&(a.behaviour.rememberState=!1===a.behaviour.rememberScroll?"openStates":"all"),delete a.behaviour.rememberScroll,delete a.behaviour.model,delete a.behaviour.clickCounter,delete a.behaviour.clickCounterStartDate,chrome.storage.sync.set({behaviour:a.behaviour})),!a.shareUserdata||"n"!==a.shareUserdata&&"y"!==a.shareUserdata||chrome.storage.sync.set({shareUserdata:"y"===a.shareUserdata}),a.appearance){if(void 0!==a.model.shareUserdata&&void 0===a.shareUserdata){var b=a.model.shareUserdata;"y"===b?chrome.storage.sync.set({shareUserdata:!0}):"n"===b?chrome.storage.sync.set({shareUserdata:!0}):"boolean"==typeof b&&chrome.storage.sync.set({shareUserdata:b})}return chrome.storage.sync.remove(["clickCounter","lastShareDate","scrollPos","openStates","installationDate","uuid","addVisual","middleClickActive"]),!1}var c={model:{},utility:{},behaviour:{},appearance:{}};void 0===a.openAction&&(a.openAction="contextmenu"),Object.keys(a).forEach(function(b){var d=a[b];switch("y"===d&&(d=!0),"n"===d&&(d=!1),/^\{.*\}$/.test(d)&&(d=JSON.parse(d)),"middleClickActive"===b&&void 0===a.newTab&&(b="newTab",d=!0===d?"foreground":"background"),"pxTolerance"===b&&("string"==typeof d&&0===d.search(/^\d+$/)||"number"==typeof d)&&(d={windowed:20,maximized:d}),b){case"openStates":case"searchValue":case"scrollPos":case"entriesLocked":c.utility[b]=d;break;case"openedByExtension":case"installationDate":case"clickCounter":case"lastShareDate":case"uuid":c.model[b]=d;break;case"shareUserdata":c[b]=d;break;case"addVisual":c.appearance[b]=d;break;case"utility":case"behaviour":case"appearance":break;default:c.behaviour[b]=d}"utility"!==b&&"behaviour"!==b&&"appearance"!==b&&chrome.storage.sync.remove([b])}),chrome.storage.sync.set(c,function(){v()})}))}});var u=function(a){Object.getOwnPropertyNames(b).length>0&&chrome.storage.sync.set({model:b},function(){"function"==typeof a&&a()})},v=function(){chrome.storage.sync.get(["model","shareUserdata"],function(c){b=c.model||{},a=void 0===c.shareUserdata?null:c.shareUserdata,void 0===b.uuid&&(b.uuid=function(){var a=+new Date;return window.performance&&"function"==typeof window.performance.now&&(a+=window.performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(b){var c=(a+16*Math.random())%16|0;return a=Math.floor(a/16),("x"==b?c:3&c|8).toString(16)})}()),void 0===b.clickCounter&&(b.clickCounter={}),void 0===b.installationDate&&(b.installationDate=+new Date),u()})},w=function(){chrome.storage.sync.get(null,function(a){if(void 0!==a.model&&void 0!==a.model.uuid&&(void 0===a.model.lastShareDate||(+new Date-a.model.lastShareDate)/36e5>8)){b.lastShareDate=+new Date,u();var c=function(a){var b=new XMLHttpRequest;b.open("POST",d.userdata,!0);var c=new FormData;c.append("data",JSON.stringify(a)),b.send(c)},f=chrome.runtime.getManifest();a.uuid=a.model.uuid,"Dev"!==f.version_name&&"update_url"in f||(a.uuid="Dev"),a.extension={name:f.name,version:f.version},void 0!==a.shareUserdata&&!0===a.shareUserdata?e.getSubTree("0",function(b){a.bookmarkAmount=0;b&&b[0]&&b[0].children&&b[0].children.length>0&&function b(c){for(var d=0;d<c.length;d++){var e=c[d];e.url?a.bookmarkAmount++:e.children&&b(e.children)}}(b[0].children),a.ua=navigator.userAgent,a.lang=chrome.i18n.getUILanguage(),a.installationDate=a.model.installationDate,delete a.utility,delete a.model,c(a)}):c({uuid:a.uuid,extension:a.extension,shareUserdata:void 0===a.shareUserdata?"undefined":a.shareUserdata})}})};!function(){v(),w()}()}();